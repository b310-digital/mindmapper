import { Component, Input } from '@angular/core'
import { ExportNodeProperties } from '@mmp/map/types'
import { TranslateService } from '@ngx-translate/core'
import { DialogService } from 'src/app/core/services/dialog/dialog.service'
import { MmpService } from 'src/app/core/services/mmp/mmp.service'

@Component({
  selector: 'teammapper-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() public node: ExportNodeProperties
  @Input() public editDisabled: boolean

  constructor (
    private translationService: TranslateService,
    private mmpService: MmpService,
    private dialogService: DialogService
   ) {
  }

  public async exportMap (format: string) {
    const result = await this.mmpService.exportMap(format)
    if(result.size > 1000 && format === 'json') alert(this.translationService.instant('MESSAGES.JSON_FILE_SIZE_TOO_LARGE'))
  }

  public async share () {
    this.dialogService.openShareDialog()
  }

  public toogleNodeFontStyle () {
    const currentStyle = this.mmpService.selectNode().font.style

    if (currentStyle === 'italic') {
      this.mmpService.updateNode('fontStyle', 'normal')
    } else {
      this.mmpService.updateNode('fontStyle', 'italic')
    }
  }

  public addLink () {
    const linkInput = prompt(this.translationService.instant('MODALS.LINK.URL'))
    if(this.isValidLink(linkInput)) this.mmpService.addNodeLink(linkInput)
  }

  public removeLink () {
    this.mmpService.removeNodeLink()
  }

  public toogleNodeFontWeight () {
    const currentWeight = this.mmpService.selectNode().font.weight

    if (currentWeight === 'bold') {
      this.mmpService.updateNode('fontWeight', 'normal')
    } else {
      this.mmpService.updateNode('fontWeight', 'bold')
    }
  }

  public async openAbout () {
    this.dialogService.openAboutDialog()
  }

  public initImageUpload (event: InputEvent) {
    const fileReader = new FileReader()

    fileReader.onload = (fileEvent: any) => {
      // in case file is an image resize it
      const img = new Image() // create a image
      img.src = fileEvent.target.result // result is base64-encoded Data URI
      img.onload = (el: any) => {
        const resizeWidth = 360 // without px
        const elem = document.createElement('canvas') // create a canvas

        // scale the image to 360 (width) and keep aspect ratio
        const scaleFactor = resizeWidth / el.target.width
        elem.width = resizeWidth
        elem.height = el.target.height * scaleFactor

        // draw in canvas
        const ctx = elem.getContext('2d')
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height)

        // set target value to empty string, otherwise new uploads are not triggered
        fileEvent.target.value = ''
        // get the base64-encoded Data URI from the resize image
        this.mmpService.addNodeImage(ctx.canvas.toDataURL('image/jpeg', 0.5))
      }
    }
    const fileUpload: HTMLInputElement = event.target as HTMLInputElement
    fileReader.readAsDataURL(fileUpload.files[0])
  }

  public initJSONUpload (event: InputEvent) {
    const fileReader = new FileReader()

    fileReader.onload = (_fileEvent: any) => {
      this.mmpService.importMap(fileReader.result.toString())
    }

    const fileUpload: HTMLInputElement = event.target as HTMLInputElement
    fileReader.readAsText(fileUpload.files[0])
  }

  private isValidLink (input: string) {
    try {
      new URL(input)
    } catch (_) {
      return false
    }
    return true
  }
}
