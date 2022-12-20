//With slight modifications, this code comes from https://github.com/arnog/mathlive/issues/1476


import { MathfieldElement } from 'mathlive';
import Quill from 'quill';
const Embed = Quill.import('blots/embed');

// Custom quill Blot to handle 'mathlive' embeds.
export class MathliveBlot extends Embed {
  static create(value: string) {
    const mfe = new MathfieldElement();
    mfe.setOptions({
      fontsDirectory: 'assets/mathlive/fonts',  // https://cortexjs.io/mathlive/guides/integration/.
      soundsDirectory: null, 
      plonkSound: null,
      keypressSound: null,
      virtualKeyboardMode: 'onfocus',  // https://cortexjs.io/mathlive/guides/virtual-keyboards/.
    });
    setTimeout(() => mfe.setAttribute('contenteditable', 'false'));  // Makes it possible to place the cursor after the math-field.
    if (value === 'INSERT') {  // Just added.
      setTimeout(() => mfe.focus());  // Trigger the math-field (focus).
    } else if ((value as any) !== true) {  // When the math-field is empty, create() is called with value true. Ignore that.
      mfe.value = value;
    }
    mfe.addEventListener('change', event => mfe.innerText = mfe.value);  // https://cortexjs.io/mathlive/guides/interacting/.
    return mfe;
  }

  static value(mfe: MathfieldElement) {
    return mfe.value;
  }
}

MathliveBlot['blotName'] = 'mathlive';
MathliveBlot['tagName'] = 'span';
MathliveBlot['className'] = 'mathlive';

Quill.register(MathliveBlot);  // Register the MathliveBlot in Quill.