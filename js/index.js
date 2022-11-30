let NodelistInputForms = document.querySelectorAll('form input')
let listErroMessage = document.querySelectorAll('.error')
let listBtnSend = document.querySelectorAll('.send')
let divProducts = document.querySelector('.products')
let btnMore = document.querySelector('#more')
let arrInputAbout = Array.from(NodelistInputForms).filter(input => {
    if (input == NodelistInputForms[0] || input == NodelistInputForms[1] || input == NodelistInputForms[2]) return input 
})

let arrInputShare = Array.from(NodelistInputForms).filter(input => {
    if (input == NodelistInputForms[5] || input == NodelistInputForms[6]) return input 
})


let endPoint = 'https://frontend-intern-challenge-api.iurykrieger.vercel.app/products?page=1'

const validarNome = (name) => {
    let padrao1 = /[a-zA-Zá-ú]/g;
    let padrao2 = /[0-9'"!@#$%&*()_+/,£¢¬§ªº°~^]/g

    let resultado

    if (name && padrao1.test(name) && !padrao2.test(name)) {
        resultado = true
    } else {
        resultado = false
    }
    
    return resultado
}

const validarCPF = (cpf) => {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	add = 0;	
	for (i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
		return false;		
	return true;   
}

const validation = (inputForm, inputValue) => {
    let regex        
    let err
    let regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    const validation = {
        name: validarNome(inputValue),
        cpf: validarCPF(inputValue),
        email: regexEmail,
        
    }

    switch (inputForm) {
        case arrInputAbout[0]:
            regex = validation.name
            err = listErroMessage[0] 
            break

        case arrInputAbout[1]:
            regex = validation.email
            err = listErroMessage[1] 
            break

        case arrInputAbout[2]:
            regex = validation.cpf
            err = listErroMessage[2]
            break
            
        case arrInputShare[0]:
            regex = validation.name
            err = listErroMessage[3]
            break

        case arrInputShare[1]:
            regex = validation.email
            err = listErroMessage[4]
            break

        default:
            console.log('Something went wrong')
    }

    
    return {
        test: !regex,
        divError: err
    }     
    

}



const getProducts = (url) => {

    fetch(url, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        let products = data.products
        endPoint = `https://${data.nextPage}`
        

        products.forEach(product => {
            divProducts.innerHTML += `
                <div class="product">
                    <div class="image">
                        <img src=${product.image} alt="product image">
                    </div>
                    <h4 class="product-title">
                        ${product.name}
                    </h4>
                    <p class="product-description">
                        ${product.description}
                    </p>
                    <p class="before-price">
                        De: R$ ${product.oldPrice}
                    </p>
                    <p class="after-price">
                        Por: R$ ${product.price}
                    </p>
                    <p class="before-price">
                        ou ${product.installments.count}x de  R$ ${product.installments.value}
                    </p>
                    <button class="btn">Comprar</button>
                </div>
            `
        })  

        
    })
}

listBtnSend.forEach((botoes) => {
    botoes.addEventListener('click', (e) => {
        e.preventDefault()
        let inputForms

        if (botoes === listBtnSend[0]) {
            inputForms = arrInputAbout
        } else {
            inputForms = arrInputShare
        }
        
        

        inputForms.forEach((input) => { 

            let objValidation = validation(input, input.value)
            
            

            if(input === inputForms[1]) {
                if(objValidation.test === false) {
                    objValidation.divError.classList.remove('error')
                    objValidation.divError.classList.add('active')
                } else {
                    objValidation.divError.classList.remove('active')
                    objValidation.divError.classList.add('error')
                }

            } else if(objValidation.test === true ) {
                objValidation.divError.classList.remove('error')
                objValidation.divError.classList.add('active')
            } else {
                objValidation.divError.classList.remove('active')
                objValidation.divError.classList.add('error')
            }
            
               
        })
    })
})

getProducts(endPoint)

btnMore.addEventListener('click', (e) => {
    e.preventDefault()

    getProducts(endPoint)
})