Feature: Login no sistema

  Scenario: Usuário faz login com credenciais corretas
    Given que estou na página de login
    When eu insiro "usuario123" no campo de usuário
    And eu insiro "senha123" no campo de senha
    And eu clico no botão de login
    Then eu devo ser redirecionado para a página inicial
