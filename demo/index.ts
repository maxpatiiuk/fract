import Fract, { el } from '../src';
import { error } from '../src/helpers';
import { defined } from '../src/types';

function Root() {
  const [value, setValue] = Fract.useState('');

  Fract.useEffect(() => {
    setTimeout(() => setValue('abc'), 1000);
  }, []);

  Fract.useEffect(() => {
    console.log('newValue', value);
    return () => console.log('oldValue', value);
  }, [value]);

  return [
    el.p({ id: 'a' }, ['Sup!', el.br({}), el.b({}, 'Bits')]),
    el.input({
      type: 'text',
      value,
      onInput: (event) =>
        console.log(
          (defined(event.target ?? undefined) as HTMLInputElement).value
        ),
    }),
  ];
}

Fract.render(Root, document.getElementById('root') ?? error('Root not found'));
