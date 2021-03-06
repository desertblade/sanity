import uploadImage from './uploadImage'
import uploadFile from './uploadFile'
import {Uploader, UploaderDef, UploadOptions} from './typedefs'
import {Type} from '../../typedefs'
import {set} from '../../utils/patches'
import {map} from 'rxjs/operators'

const UPLOAD_IMAGE: UploaderDef = {
  type: 'image',
  accepts: 'image/*',
  upload: (file: File, type?: Type, options?: UploadOptions) => uploadImage(file, options)
}

const UPLOAD_FILE: UploaderDef = {
  type: 'file',
  accepts: '',
  upload: (file: File, type: Type, options?: UploadOptions) => uploadFile(file, options)
}

const UPLOAD_TEXT: UploaderDef = {
  type: 'string',
  accepts: 'text/*',
  upload: (file: File, type: Type, options?: UploadOptions) =>
    uploadFile(file, options).pipe(
      map(content => ({
        type: 'uploadEvent',
        patches: [set(content)]
      }))
    )
  // Todo: promote this to a "first-class" form-builder abstraction
  // and make it possible to register custom uploaders
}

const uploaders: Array<Uploader> = [UPLOAD_IMAGE, UPLOAD_TEXT, UPLOAD_FILE].map((uploader, i) => ({
  ...uploader,
  priority: i
}))

export default uploaders
