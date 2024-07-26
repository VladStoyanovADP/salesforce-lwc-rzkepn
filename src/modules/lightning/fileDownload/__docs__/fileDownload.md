Add file downloads to Experience Cloud sites that use the Build Your Own (LWR) template.

To create a component that downloads a file, import `generateUrl` from `lightning/fileDownload`. Use the `generateUrl` function and pass in the record ID number of the files that you want to download. This function supports Content Document, Content Version, Attachment, or Document record IDs.

This example returns a download URL that you can pass into `window.open` to download the file.

```javascript
import { generateUrl } from 'lightning/fileDownload';
const url = generateUrl(recordId);
window.open(url);
```

In this example, clicking a download button on a record generates a URL and uses it to download the record's files.

```HTML
<template>
  <div>
      <lightning-input type="text" label="File download for the record" value={recordId}></lightning-input>
      <lightning-button label="Download" onclick={handleClick} class="slds-m-left_x-small"></lightning-button>
  </div>
</template>
```

```Javascript
import { LightningElement } from 'lwc';
import { generateUrl } from 'lightning/fileDownload';
export default class Download extends LightningElement {
    recordId;
    url;
    handleClick() {
        this.url = generateUrl(this.recordId);
        window.open(this.url)
    }
}
```

#### Considerations

- Authenticated users can download any files they have access to. Unauthenticated users can only download Content Document files that they can access with a Library membership.

- The `recordId` parameter in `generateUrl` accepts IDs for Content Document, Content Version, Attachment, or Document files.
