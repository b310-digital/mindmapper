import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor(private translateService: TranslateService) {
    }

    /**
     * Gets the nested property of object
     */
    public static get = (obj: any, path: string[]) =>
         path.reduce((nestedObj, currentPath) => (nestedObj && nestedObj[currentPath]) ? nestedObj[currentPath] : null, obj)

    /**
     * Return the word with the first letter capitalized.
     */
    public static capitalizeWord(word: string): string {
        if(word === undefined || word === '') return '' 
        return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)
    }

    /**
     * Return an observable for drop events for images.
     */
    public static observableDroppedImages(): Observable<string> {
        return new Observable((subscriber) => {
            window.document.ondragover = (event: DragEvent) => {
                event.preventDefault()
            }

            window.document.body.ondrop = (event: DragEvent) => {
                event.preventDefault()

                if (event.dataTransfer.files[0]) {
                    const fileReader = new FileReader()

                    fileReader.onload = () => {
                        subscriber.next(fileReader.result.toString())
                    }

                    fileReader.onerror = subscriber.error

                    fileReader.readAsDataURL(event.dataTransfer.files[0])
                } else {
                    subscriber.next(event.dataTransfer.getData('text/html').match(/src\s*=\s*"(.+?)"/)[1])

                }
            }
        })
    }

    /**
     * Upload a file with a fake input click.
     */
    public static uploadFile(accept: string[] | string = 'application/json'): Promise<string> {
        const fakeInput: HTMLInputElement = document.createElement('input')
        fakeInput.type = 'file'
        fakeInput.accept = Array.isArray(accept) ? accept.join(',') : accept
        document.body.appendChild(fakeInput)

        // Open bug (not critical): If the user presses cancel, the input element is NOT removed.
        // It cant be directly removed, because ios camera capture might still need it,
        // so need to wait for the user to finish file upload. But canceling the dialog 
        // does not fire any event at all - so its hard to guess when the user has actually canceled
        // and the input field has to be deleted. This creates useless file input elements inside the DOM. 
        const uploadPromise: Promise<string> = new Promise((resolve, reject) => {
            fakeInput.addEventListener('change', () => {               
                const fileReader = new FileReader()

                fileReader.onload = (event: any) => {
                    if (accept === 'application/json') {
                        resolve(fileReader.result.toString())
                    } else {
                        // in case file is an image resize it
                        const img = new Image()// create a image
                        img.src = event.target.result // result is base64-encoded Data URI
                        img.onload = function (el: any) {
                            const resizeWidth = 360 // without px
                            const elem = document.createElement('canvas') // create a canvas

                            // scale the image to 360 (width) and keep aspect ratio
                            const scaleFactor = resizeWidth / el.target.width
                            elem.width = resizeWidth
                            elem.height = el.target.height * scaleFactor

                            // draw in canvas
                            const ctx = elem.getContext('2d')
                            ctx.drawImage(el.target, 0, 0, elem.width, elem.height)

                            // get the base64-encoded Data URI from the resize image
                            const srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg')

                            resolve(srcEncoded)
                        }
                    }
                }
                fileReader.onerror = reject

                if (accept === 'application/json') {
                    fileReader.readAsText(fakeInput.files[0])
                } else {
                    fileReader.readAsDataURL(fakeInput.files[0])
                }
            })
            fakeInput.onerror = reject
        })

        uploadPromise.finally(() => {
            document.body.removeChild(fakeInput)
        })

        fakeInput.click()

        return uploadPromise
    }

    /**
     * Download a file with a fake link click.
     */
    public static downloadFile(name: string, content: string) {
        const fakeLink = document.createElement('a')

        fakeLink.href = content
        fakeLink.download = name

        document.body.appendChild(fakeLink)

        fakeLink.click()

        document.body.removeChild(fakeLink)
    }

    /**
     * Return the HTML image element from an image URI.
     */
    public static imageFromUri(uri: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image()

            image.onload = () => {
                resolve(image)
            }
            image.onerror = reject
            image.src = uri
        })
    }

    /**
     * Return the status of the full screen mode.
     */
    public static isFullScreen(): boolean {
        return !!window.document.fullscreenElement
    }

    /**
     * Toggle the full screen mode.
     */
    public static toggleFullScreen() {
        if (UtilsService.isFullScreen()) {
            window.document.exitFullscreen()
        } else {
            window.document.querySelector('html').requestFullscreen()
        }
    }

    /**
     * Return true if the string is a JSON Object.
     */
    public static isJSONString(JSONString: string) {
        try {
            JSON.parse(JSONString)
        } catch (e) {
            return false
        }
        return true
    }

    /**
     * Return true if the two objects have the same structure (same keys).
     */
    public static isSameJSONStructure(json1: object, json2: object): boolean {
        function checkObjectStructure (object1: object, object2: object): boolean {
            for (const key of Object.keys(object1)) {
                if (!object1.hasOwnProperty(key) || !object2.hasOwnProperty(key)) {
                    return false
                }

                if (typeof object1[key] === 'object') {
                    if (!checkObjectStructure(object1[key], object2[key])) {
                        return false
                    }
                }
            }

            return true
        }

        return checkObjectStructure(json1, json2) && checkObjectStructure(json2, json1)
    }

    /**
     * Return a translated string with given message and values.
     */
    public translate(message: string, values?: any): Promise<string> {
        return this.translateService.get(message, values).toPromise()
    }

    /**
     * Show a dialog window to confirm a choice.
     */
    public async confirmDialog(message: string): Promise<boolean> {
        message = await this.translate(message)

        return confirm(message)
    }

}
