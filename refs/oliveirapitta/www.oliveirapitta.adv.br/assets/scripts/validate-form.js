// Função para verificar o estado do input
function handleInput(element) {
  const inputGroup = element.parentElement;

  // Verifica se o campo está vazio ou preenchido
  if (element.value.trim() !== '') {
    inputGroup.classList.add('isComplete');
    inputGroup.classList.remove('error');
  } else {
    inputGroup.classList.remove('isComplete');
    inputGroup.classList.add('error');
  }
}

// Função para verificar os inputs ao submeter o formulário
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required]');

  inputs.forEach(input => {
    handleInput(input); // Verifica cada input ao submeter o formulário
  });

  // Retorna true ou false dependendo se todos os campos são válidos
  return !form.querySelector('.error');
}

// Função para adicionar os eventos de foco e desfoco
function addFocusBlurEvents() {
  const inputs = document.querySelectorAll('input[required]');

  inputs.forEach(input => {
    input.addEventListener('focus', () => handleInput(input)); // Verifica quando o input recebe o foco
    input.addEventListener('blur', () => handleInput(input));  // Verifica quando o input perde o foco
  });
}

// Chame a função para adicionar os eventos
addFocusBlurEvents();

var contact = document.querySelector('#contact');
if(contact){
// Exemplo de envio do formulário
document.querySelector('#contact').addEventListener('submit', function (event) {
  if (!validateForm(this)) {
    event.preventDefault(); // Impede o envio do formulário se houver erro
  }
});
}