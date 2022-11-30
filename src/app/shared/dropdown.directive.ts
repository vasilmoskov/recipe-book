import {Directive, ElementRef, HostBinding, HostListener, Renderer2} from "@angular/core";

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: Event) {
    this.isOpen = this.elementRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  // Closing only when button clicked:

  // @HostListener('click') onMouseClick() {
  //   this.isOpen = !this.isOpen;
  // }

  // @HostListener('click') onMouseClick(event: Event) {
    // if (this.elementRef.nativeElement.classList.contains('open')) {
    //   this.renderer.removeClass(this.elementRef.nativeElement, 'open');
    // } else {
    //   this.renderer.addClass(this.elementRef.nativeElement, 'open');
    // }
  // }
}
