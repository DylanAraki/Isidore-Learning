import Quill from 'quill';
import { Path, Landmark } from './content';
const Inline = Quill.import('blots/inline');

export class PathLinkBlot extends Inline {
    private reference!: [Path, Landmark];
    private state!: [Path, Landmark][];

    static create(path: Path, landmark: Landmark, state: [Path, Landmark][]) {
        let node = super.create();
        this['reference'] = [path, landmark];
        this['state'] = state;
        console.log(path)
            console.log(landmark)
        //node.setAttribute('href', url);
        //node.setAttribute('target', '_blank');
        //node.setAttribute('title', node.textContent);
        node.addEventListener('click', (event: any)=>{ 
            console.log(event)
            console.log(this)
            
            console.log(this['reference'])
            this['state'].push(this['reference']);
         })
        console.log("Created");
        console.log(node);
        return node;
      }
    
      /* static formats(domNode: any) {
        return domNode.getAttribute('href') || true;
      }
    
      format(name: string, value: string) {
        if (name === 'link' && value) {
          this['domNode'].setAttribute('href', value);
        } else {
          super.format(name, value);
        }
      }
    
      formats() {
        let formats = super.formats();
        formats['link'] = PathLinkBlot.formats(this['domNode']);
        return formats;
      } */
}

PathLinkBlot['blotName'] = 'link';
PathLinkBlot['tagName'] = 'A';

Quill.register(PathLinkBlot);