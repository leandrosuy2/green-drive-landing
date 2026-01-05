# Documentação da Integração de Locações

## Atualização: Garantia do Campo `id_car` no Frontend

A partir da versão atual, o frontend garante que todos os objetos de locação recebidos da API possuem o campo `id_car`, mesmo que o backend não envie esse campo em alguns registros. Isso evita erros de acesso e facilita a integração com funcionalidades que dependem desse identificador.

### Como funciona
- Ao consumir o serviço `listarLocacoes` (`src/services/locacaoService.ts`), o frontend faz um ajuste para garantir que cada objeto da lista tenha o campo `id_car`. Se o backend não enviar, o valor será `null`.
- Isso garante previsibilidade para componentes que usam o campo, como a listagem de documentação de veículos.

### Exemplo de uso
```typescript
useEffect(() => {
  locacaoService.listarLocacoes()
    .then((data) => {
      const ajustado = data.map(loc => ({ id_car: null, ...loc }));
      setLocacoes(ajustado);
    });
}, []);
```

### Benefícios
- Evita erros de acesso a propriedades inexistentes.
- Facilita a manutenção e evolução do código.
- Garante compatibilidade com integrações futuras.

---

Consulte o README principal para instruções de uso e execução do projeto.
