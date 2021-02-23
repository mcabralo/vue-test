import Lance from "@/components/Lance";
import { mount } from "@vue/test-utils";

describe("Um lance sem valor minimo", () => {
  test("Não aceita lance com valor menor do que zero", () => {
    const wrapper = mount(Lance);
    const input = wrapper.find("input");
    input.setValue(-100);
    wrapper.trigger("submit");
    const lancesEmitidos = wrapper.emitted("novo-lance");
    expect(lancesEmitidos).toBeUndefined;
  });

  test("Emite um lance quando o valor é maior do que zero", () => {
    const wrapper = mount(Lance);
    const input = wrapper.find("input");
    input.setValue(100);
    wrapper.trigger("submit");
    const lancesEmitidos = wrapper.emitted("novo-lance");
    expect(lancesEmitidos).toHaveLength(1);
  });

  test("emite o valor esperado de um lance válido", () => {
    const wrapper = mount(Lance);
    const input = wrapper.find("input");
    input.setValue(100);
    wrapper.trigger("submit");
    const lancesEmitidos = wrapper.emitted("novo-lance");
    const lance = parseInt(lancesEmitidos[0][0]);
    expect(lance).toBe(100);
  });
});

describe('Um lance com valor mínimo', () => {
  test('Todos os lances devem possuir um valor maior que o mínimo for informado', () => {
    const wrapper = mount(Lance, {
      propsData: {
        lanceMinimo: 300
      }
    })
    const input = wrapper.find('input')
    input.setValue(400)
    wrapper.trigger('submit')
    const lancesEmitidos = wrapper.emitted('novo-lance')
    expect(lancesEmitidos).toHaveLength(1)
  })
  test('Emite o valor esperado de um lance válido', () => {
    const wrapper = mount(Lance, {
      propsData: {
        lanceMinimo: 300
      }
    })
    const input = wrapper.find('input')
    input.setValue(400)
    wrapper.trigger('submit')
    const lancesEmitidos = wrapper.emitted('novo-lance') //! O retorno do 'emitted' é um array de arrays [[400]]
    expect(lancesEmitidos).toHaveLength(1)
    const valorDoLance = parseInt(lancesEmitidos[0][0])
    expect(valorDoLance).toBe(400)
  })
  test('Não são aceitos lances com valores menores que o mínimo informado', async() => {
    const wrapper = mount(Lance, {
      propsData: {
        lanceMinimo: 300
      }
    })
    const input = wrapper.find('input')
    input.setValue(100)
    wrapper.trigger('submit')
    await wrapper.vm.$nextTick() // o teste iria retornar sem o argumento da função 'async' e sem esse await porque 
    //o dom ainda não havia sido atualizado. Next Tick é justamente a função que resgata essa resposta com o await
    const msgErro = wrapper.find('p.alert').element.textContent //Buscar e Capturar o alert do erro, presente no componente
    const msgEsperada = 'O valor mínimo para o lance é de R$ 300'
    expect(msgErro).toContain(msgEsperada)
  })
})
