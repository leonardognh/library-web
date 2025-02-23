Feature: Loja da livraria

  Background:
    Given o usuário está logado

  Scenario: Acessar a página de produtos
    When eu estou na página da loja da livraria
    Then a lista de produtos deve ser exibida

  Scenario: Usuário pesquisa livros
    Given o usuário está logado
    When eu pesquiso por "Harry Potter" no campo de pesquisa
    Then a página deve filtrar os itens que contém esse título