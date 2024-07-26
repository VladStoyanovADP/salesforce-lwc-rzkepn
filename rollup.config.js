import lwcRollupPlugin from '@lwc/rollup-plugin';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const __ENV__ = process.env.NODE_ENV ?? 'development';

export default (args) => {
    return {
        input: 'src/main.js',

        output: {
            dir: 'dist',
            format: 'esm',
        },

        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify(__ENV__),
                preventAssignment: true,
            }),
            lwcRollupPlugin({
                modules: [
                  {
                    "name": "@salesforce/label/LightningForm.edit",
                    "path": "scopedImports/@salesforce-label-LightningForm.edit.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.undo",
                        "path": "scopedImports/@salesforce-label-LightningForm.undo.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.saveFieldErrorSummary",
                        "path": "scopedImports/@salesforce-label-LightningForm.saveFieldErrorSummary.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.preview",
                        "path": "scopedImports/@salesforce-label-LightningForm.preview.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.previewHeader",
                        "path": "scopedImports/@salesforce-label-LightningForm.previewHeader.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.save",
                        "path": "scopedImports/@salesforce-label-LightningForm.save.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.cancel",
                        "path": "scopedImports/@salesforce-label-LightningForm.cancel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.error",
                        "path": "scopedImports/@salesforce-label-LightningForm.error.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.editErrorHelp",
                        "path": "scopedImports/@salesforce-label-LightningForm.editErrorHelp.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.errorPopoverHeading",
                        "path": "scopedImports/@salesforce-label-LightningForm.errorPopoverHeading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.closeError",
                        "path": "scopedImports/@salesforce-label-LightningForm.closeError.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.reload",
                        "path": "scopedImports/@salesforce-label-LightningForm.reload.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.generalDependentFieldsMessage",
                        "path": "scopedImports/@salesforce-label-LightningForm.generalDependentFieldsMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.learnMore",
                        "path": "scopedImports/@salesforce-label-LightningForm.learnMore.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.dependentFieldsListHeading",
                        "path": "scopedImports/@salesforce-label-LightningForm.dependentFieldsListHeading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.dependentFieldsHeader",
                        "path": "scopedImports/@salesforce-label-LightningForm.dependentFieldsHeader.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.controllerFieldsMessage",
                        "path": "scopedImports/@salesforce-label-LightningForm.controllerFieldsMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningForm.okButton",
                        "path": "scopedImports/@salesforce-label-LightningForm.okButton.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityBadInput",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityBadInput.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityPatternMismatch",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityPatternMismatch.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityTypeMismatch",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityTypeMismatch.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityValueMissing",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityValueMissing.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityRangeOverflow",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityRangeOverflow.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityRangeUnderflow",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityRangeUnderflow.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityStepMismatch",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityStepMismatch.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityTooLong",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityTooLong.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validityTooShort",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validityTooShort.js"
                    },
                    {
                        "name": "@salesforce/label/LightningErrorMessage.validitySelectAtleastOne",
                        "path": "scopedImports/@salesforce-label-LightningErrorMessage.validitySelectAtleastOne.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCarousel.tabString",
                        "path": "scopedImports/@salesforce-label-LightningCarousel.tabString.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCarousel.autoPlay",
                        "path": "scopedImports/@salesforce-label-LightningCarousel.autoPlay.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputFile.buttonLabel",
                        "path": "scopedImports/@salesforce-label-LightningInputFile.buttonLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputFile.bodyText",
                        "path": "scopedImports/@salesforce-label-LightningInputFile.bodyText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputLocation.latitude",
                        "path": "scopedImports/@salesforce-label-LightningInputLocation.latitude.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputLocation.longitude",
                        "path": "scopedImports/@salesforce-label-LightningInputLocation.longitude.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputLocation.invalidLatitude",
                        "path": "scopedImports/@salesforce-label-LightningInputLocation.invalidLatitude.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputLocation.invalidLongitude",
                        "path": "scopedImports/@salesforce-label-LightningInputLocation.invalidLongitude.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputLocation.coordinateIsRequired",
                        "path": "scopedImports/@salesforce-label-LightningInputLocation.coordinateIsRequired.js"
                    },
                    {
                        "name": "@salesforce/label/LightningFormattedEmail.emailIconLabel",
                        "path": "scopedImports/@salesforce-label-LightningFormattedEmail.emailIconLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextAssist.chooseFont",
                        "path": "scopedImports/@salesforce-label-LightningRichTextAssist.chooseFont.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextAssist.chooseSize",
                        "path": "scopedImports/@salesforce-label-LightningRichTextAssist.chooseSize.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextAssist.composeText",
                        "path": "scopedImports/@salesforce-label-LightningRichTextAssist.composeText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.bold",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.bold.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.italic",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.italic.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.underline",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.underline.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.strike",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.strike.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.bullet",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.bullet.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.number",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.number.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.indent",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.indent.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.outdent",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.outdent.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.leftAlign",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.leftAlign.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.centerAlign",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.centerAlign.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.rightAlign",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.rightAlign.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.moreActions",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.moreActions.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.link",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.link.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.image",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.image.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.video",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.video.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextButton.removeFormatting",
                        "path": "scopedImports/@salesforce-label-LightningRichTextButton.removeFormatting.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.formatText",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.formatText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.formatBackground",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.formatBackground.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.formatBody",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.formatBody.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.alignText",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.alignText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.insertContent",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.insertContent.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.insertVideo",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.insertVideo.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.removeFormatting",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.removeFormatting.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.formatFont",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.formatFont.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.font",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.font.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.fontSize",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.fontSize.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.colorPicker",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.colorPicker.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.linkInputTitle",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.linkInputTitle.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.linkInput",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.linkInput.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.linkSave",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.linkSave.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.linkCancel",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.linkCancel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.imageSizeExceeded",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.imageSizeExceeded.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.imageUploadFailed",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.imageUploadFailed.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRichTextEditor.imageUploadNotSupported",
                        "path": "scopedImports/@salesforce-label-LightningRichTextEditor.imageUploadNotSupported.js"
                    },
                    {
                        "name": "@salesforce/label/LightningControl.required",
                        "path": "scopedImports/@salesforce-label-LightningControl.required.js"
                    },
                    {
                        "name": "@salesforce/label/LightningControl.active",
                        "path": "scopedImports/@salesforce-label-LightningControl.active.js"
                    },
                    {
                        "name": "@salesforce/label/LightningControl.activeCapitalized",
                        "path": "scopedImports/@salesforce-label-LightningControl.activeCapitalized.js"
                    },
                    {
                        "name": "@salesforce/label/LightningControl.inactive",
                        "path": "scopedImports/@salesforce-label-LightningControl.inactive.js"
                    },
                    {
                        "name": "@salesforce/label/LightningControl.inactiveCapitalized",
                        "path": "scopedImports/@salesforce-label-LightningControl.inactiveCapitalized.js"
                    },
                    {
                        "name": "@salesforce/label/LightningControl.loading",
                        "path": "scopedImports/@salesforce-label-LightningControl.loading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningControl.clear",
                        "path": "scopedImports/@salesforce-label-LightningControl.clear.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputNumber.incrementCounter",
                        "path": "scopedImports/@salesforce-label-LightningInputNumber.incrementCounter.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputNumber.decrementCounter",
                        "path": "scopedImports/@salesforce-label-LightningInputNumber.decrementCounter.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPill.warning",
                        "path": "scopedImports/@salesforce-label-LightningPill.warning.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPill.remove",
                        "path": "scopedImports/@salesforce-label-LightningPill.remove.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPill.error",
                        "path": "scopedImports/@salesforce-label-LightningPill.error.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPill.delete",
                        "path": "scopedImports/@salesforce-label-LightningPill.delete.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPill.deleteAndNavigate",
                        "path": "scopedImports/@salesforce-label-LightningPill.deleteAndNavigate.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPillContainer.label",
                        "path": "scopedImports/@salesforce-label-LightningPillContainer.label.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPillContainer.more",
                        "path": "scopedImports/@salesforce-label-LightningPillContainer.more.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressBar.progress",
                        "path": "scopedImports/@salesforce-label-LightningProgressBar.progress.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressBar.progressBar",
                        "path": "scopedImports/@salesforce-label-LightningProgressBar.progressBar.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressRing.progressRing",
                        "path": "scopedImports/@salesforce-label-LightningProgressRing.progressRing.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressRing.warning",
                        "path": "scopedImports/@salesforce-label-LightningProgressRing.warning.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressRing.expired",
                        "path": "scopedImports/@salesforce-label-LightningProgressRing.expired.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressRing.complete",
                        "path": "scopedImports/@salesforce-label-LightningProgressRing.complete.js"
                    },
                    {
                        "name": "@salesforce/label/LightningClickToDial.enabled",
                        "path": "scopedImports/@salesforce-label-LightningClickToDial.enabled.js"
                    },
                    {
                        "name": "@salesforce/label/LightningClickToDial.disabled",
                        "path": "scopedImports/@salesforce-label-LightningClickToDial.disabled.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.componentAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.componentAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.moveSelectionToAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.moveSelectionToAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.upButtonAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.upButtonAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.downButtonAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.downButtonAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.optionLockAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.optionLockAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.maxHelp",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.maxHelp.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.minHelp",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.minHelp.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.maxError",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.maxError.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.minErrorPlural",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.minErrorPlural.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.minErrorSingular",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.minErrorSingular.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.requiredError",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.requiredError.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.minRequiredErrorPlural",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.minRequiredErrorPlural.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.minRequiredErrorSingular",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.minRequiredErrorSingular.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.requiredOptionError",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.requiredOptionError.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.movedOptionsSingular",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.movedOptionsSingular.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.movedOptionsPlural",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.movedOptionsPlural.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.verticallyMovedOptions",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.verticallyMovedOptions.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDualListbox.moveToAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningDualListbox.moveToAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressIndicator.stageComplete",
                        "path": "scopedImports/@salesforce-label-LightningProgressIndicator.stageComplete.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressIndicator.currentStage",
                        "path": "scopedImports/@salesforce-label-LightningProgressIndicator.currentStage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressIndicator.stageNotStarted",
                        "path": "scopedImports/@salesforce-label-LightningProgressIndicator.stageNotStarted.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressIndicator.errorStage",
                        "path": "scopedImports/@salesforce-label-LightningProgressIndicator.errorStage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningProgressIndicator.pathCurrentStage",
                        "path": "scopedImports/@salesforce-label-LightningProgressIndicator.pathCurrentStage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningListView.loadMore",
                        "path": "scopedImports/@salesforce-label-LightningListView.loadMore.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.selectAll",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.selectAll.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.selectItem",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.selectItem.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.columnWidth",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.columnWidth.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.sort",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.sort.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.sortAsc",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.sortAsc.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.sortDesc",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.sortDesc.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.sortNone",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.sortNone.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.loading",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.loading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.showActions",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.showActions.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.wrapText",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.wrapText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.clipText",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.clipText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.edit",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.edit.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.editHasError",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.editHasError.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.chooseARow",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.chooseARow.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.chooseARowSelectAll",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.chooseARowSelectAll.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.save",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.save.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.apply",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.apply.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.cancel",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.cancel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.error",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.error.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.closeButtonAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.closeButtonAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.rowLevelErrorAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.rowLevelErrorAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.updateSelectedItems",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.updateSelectedItems.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.rowActionsDefaultAriaLabel",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.rowActionsDefaultAriaLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.ariaLiveNavigationMode",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.ariaLiveNavigationMode.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.ariaLiveActionMode",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.ariaLiveActionMode.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.rowNumber",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.rowNumber.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.true",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.true.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.false",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.false.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.sortingMenuTooltip",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.sortingMenuTooltip.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.sortingMenuMultiColumnSort",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.sortingMenuMultiColumnSort.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.sortingMenuRows",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.sortingMenuRows.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.sortingMenuColumns",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.sortingMenuColumns.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDatatable.multiColumnSortingToast",
                        "path": "scopedImports/@salesforce-label-LightningDatatable.multiColumnSortingToast.js"
                    },
                    {
                        "name": "@salesforce/label/LightningVerticalNavigation.newItems",
                        "path": "scopedImports/@salesforce-label-LightningVerticalNavigation.newItems.js"
                    },
                    {
                        "name": "@salesforce/label/LightningVerticalNavigation.showLess",
                        "path": "scopedImports/@salesforce-label-LightningVerticalNavigation.showLess.js"
                    },
                    {
                        "name": "@salesforce/label/LightningVerticalNavigation.showMore",
                        "path": "scopedImports/@salesforce-label-LightningVerticalNavigation.showMore.js"
                    },
                    {
                        "name": "@salesforce/label/LightningVerticalNavigation.subPage",
                        "path": "scopedImports/@salesforce-label-LightningVerticalNavigation.subPage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningNoticeFooter.okButton",
                        "path": "scopedImports/@salesforce-label-LightningNoticeFooter.okButton.js"
                    },
                    {
                        "name": "@salesforce/label/LightningSlider.slider",
                        "path": "scopedImports/@salesforce-label-LightningSlider.slider.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCombobox.placeholder",
                        "path": "scopedImports/@salesforce-label-LightningCombobox.placeholder.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCombobox.pillCloseButtonAlternativeText",
                        "path": "scopedImports/@salesforce-label-LightningCombobox.pillCloseButtonAlternativeText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCombobox.selectedLabelSingle",
                        "path": "scopedImports/@salesforce-label-LightningCombobox.selectedLabelSingle.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCombobox.selectedLabelMore",
                        "path": "scopedImports/@salesforce-label-LightningCombobox.selectedLabelMore.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCombobox.currentSelection",
                        "path": "scopedImports/@salesforce-label-LightningCombobox.currentSelection.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCombobox.ariaSelectedOptions",
                        "path": "scopedImports/@salesforce-label-LightningCombobox.ariaSelectedOptions.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCombobox.loadingText",
                        "path": "scopedImports/@salesforce-label-LightningCombobox.loadingText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningCombobox.deselectOptionKeyboard",
                        "path": "scopedImports/@salesforce-label-LightningCombobox.deselectOptionKeyboard.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPickerPanel.defaultTab",
                        "path": "scopedImports/@salesforce-label-LightningColorPickerPanel.defaultTab.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPickerPanel.customTab",
                        "path": "scopedImports/@salesforce-label-LightningColorPickerPanel.customTab.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.colorPickerInstructions",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.colorPickerInstructions.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.a11yTriggerText",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.a11yTriggerText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.a11yDefaultText",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.a11yDefaultText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.hueInput",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.hueInput.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.hexLabel",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.hexLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.redAbbr",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.redAbbr.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.rInput",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.rInput.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.greenAbbr",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.greenAbbr.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.gInput",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.gInput.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.blueAbbr",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.blueAbbr.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.bInput",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.bInput.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.doneButton",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.doneButton.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.cancelButton",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.cancelButton.js"
                    },
                    {
                        "name": "@salesforce/label/LightningColorPicker.errorMessage",
                        "path": "scopedImports/@salesforce-label-LightningColorPicker.errorMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningHelptext.buttonAlternativeText",
                        "path": "scopedImports/@salesforce-label-LightningHelptext.buttonAlternativeText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningTree.expandBranch",
                        "path": "scopedImports/@salesforce-label-LightningTree.expandBranch.js"
                    },
                    {
                        "name": "@salesforce/label/LightningTree.collapseBranch",
                        "path": "scopedImports/@salesforce-label-LightningTree.collapseBranch.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.previousMonth",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.previousMonth.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.nextMonth",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.nextMonth.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.yearSelector",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.yearSelector.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.today",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.today.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.ariaLabelMonth",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.ariaLabelMonth.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.selectDate",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.selectDate.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.selectDateFor",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.selectDateFor.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.dateLabel",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.dateLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.timeLabel",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.timeLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.invalidDate",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.invalidDate.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.rangeOverflow",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.rangeOverflow.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.rangeUnderflow",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.rangeUnderflow.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.minRangeMessage",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.minRangeMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.maxRangeMessage",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.maxRangeMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDateTimePicker.minAndMaxRangeMessage",
                        "path": "scopedImports/@salesforce-label-LightningDateTimePicker.minAndMaxRangeMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveCellActions.showActions",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveCellActions.showActions.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveCellActions.loadingActions",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveCellActions.loadingActions.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputName.salutation",
                        "path": "scopedImports/@salesforce-label-LightningInputName.salutation.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputName.firstName",
                        "path": "scopedImports/@salesforce-label-LightningInputName.firstName.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputName.middleName",
                        "path": "scopedImports/@salesforce-label-LightningInputName.middleName.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputName.informalName",
                        "path": "scopedImports/@salesforce-label-LightningInputName.informalName.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputName.lastName",
                        "path": "scopedImports/@salesforce-label-LightningInputName.lastName.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputName.suffix",
                        "path": "scopedImports/@salesforce-label-LightningInputName.suffix.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInputName.none",
                        "path": "scopedImports/@salesforce-label-LightningInputName.none.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveCellTree.expandBranch",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveCellTree.expandBranch.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveCellTree.collapseBranch",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveCellTree.collapseBranch.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordEditForm.apiNameMismatch",
                        "path": "scopedImports/@salesforce-label-LightningRecordEditForm.apiNameMismatch.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordEditForm.genericError",
                        "path": "scopedImports/@salesforce-label-LightningRecordEditForm.genericError.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordEditForm.invalidID",
                        "path": "scopedImports/@salesforce-label-LightningRecordEditForm.invalidID.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordEditForm.invalidActionAsHandler",
                        "path": "scopedImports/@salesforce-label-LightningRecordEditForm.invalidActionAsHandler.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordForm.save",
                        "path": "scopedImports/@salesforce-label-LightningRecordForm.save.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordForm.cancel",
                        "path": "scopedImports/@salesforce-label-LightningRecordForm.cancel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordForm.loading",
                        "path": "scopedImports/@salesforce-label-LightningRecordForm.loading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordForm.edit",
                        "path": "scopedImports/@salesforce-label-LightningRecordForm.edit.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.add",
                        "path": "scopedImports/@salesforce-label-LightningLookup.add.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.advancedSearchMobile",
                        "path": "scopedImports/@salesforce-label-LightningLookup.advancedSearchMobile.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.createNewObject",
                        "path": "scopedImports/@salesforce-label-LightningLookup.createNewObject.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.currentSelection",
                        "path": "scopedImports/@salesforce-label-LightningLookup.currentSelection.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.emptyStateNoResultText",
                        "path": "scopedImports/@salesforce-label-LightningLookup.emptyStateNoResultText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.emptyStateNoResultMRUText",
                        "path": "scopedImports/@salesforce-label-LightningLookup.emptyStateNoResultMRUText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.emptyStateNoResultMRUWithoutText",
                        "path": "scopedImports/@salesforce-label-LightningLookup.emptyStateNoResultMRUWithoutText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.messageWhenBadInputDefault",
                        "path": "scopedImports/@salesforce-label-LightningLookup.messageWhenBadInputDefault.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.panelHeaderMobile",
                        "path": "scopedImports/@salesforce-label-LightningLookup.panelHeaderMobile.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.recentObject",
                        "path": "scopedImports/@salesforce-label-LightningLookup.recentObject.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.recentItems",
                        "path": "scopedImports/@salesforce-label-LightningLookup.recentItems.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.resultsListHeaderMobile",
                        "path": "scopedImports/@salesforce-label-LightningLookup.resultsListHeaderMobile.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.search",
                        "path": "scopedImports/@salesforce-label-LightningLookup.search.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.searchObjectsPlaceholder",
                        "path": "scopedImports/@salesforce-label-LightningLookup.searchObjectsPlaceholder.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.searchObjectsPlaceholderMobile",
                        "path": "scopedImports/@salesforce-label-LightningLookup.searchObjectsPlaceholderMobile.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.searchPlaceholder",
                        "path": "scopedImports/@salesforce-label-LightningLookup.searchPlaceholder.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.searchForInObject",
                        "path": "scopedImports/@salesforce-label-LightningLookup.searchForInObject.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.selectObject",
                        "path": "scopedImports/@salesforce-label-LightningLookup.selectObject.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.typeaheadResultsListHeaderMobile",
                        "path": "scopedImports/@salesforce-label-LightningLookup.typeaheadResultsListHeaderMobile.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.unknownRecord",
                        "path": "scopedImports/@salesforce-label-LightningLookup.unknownRecord.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.none",
                        "path": "scopedImports/@salesforce-label-LightningLookup.none.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.messageWhenMissingInformation",
                        "path": "scopedImports/@salesforce-label-LightningLookup.messageWhenMissingInformation.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.noAccess",
                        "path": "scopedImports/@salesforce-label-LightningLookup.noAccess.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.modalSelect",
                        "path": "scopedImports/@salesforce-label-LightningLookup.modalSelect.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.modalCancel",
                        "path": "scopedImports/@salesforce-label-LightningLookup.modalCancel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningLookup.modalTitle",
                        "path": "scopedImports/@salesforce-label-LightningLookup.modalTitle.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.invalidConfigurationErrorMessage",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.invalidConfigurationErrorMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.dataSourceErrorMessage",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.dataSourceErrorMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.defaultSelectedRecordErrorMessage",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.defaultSelectedRecordErrorMessage.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.loadingPlaceholder",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.loadingPlaceholder.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.messageWhenBadInputDefault",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.messageWhenBadInputDefault.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.messageWhenSearchTermTooShort",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.messageWhenSearchTermTooShort.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.resultCountDescriptionForOneRecord",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.resultCountDescriptionForOneRecord.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.resultCountDescriptionForMultipleRecords",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.resultCountDescriptionForMultipleRecords.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.resultCountDescriptionForMoreThanOneHundredRecords",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.resultCountDescriptionForMoreThanOneHundredRecords.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.resultsLoading",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.resultsLoading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.searchInputHelp",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.searchInputHelp.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.emptyStateNoResultText",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.emptyStateNoResultText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRecordPicker.actionIconAlternativeText",
                        "path": "scopedImports/@salesforce-label-LightningRecordPicker.actionIconAlternativeText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPicklist.available",
                        "path": "scopedImports/@salesforce-label-LightningPicklist.available.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPicklist.chosen",
                        "path": "scopedImports/@salesforce-label-LightningPicklist.chosen.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPicklist.noneLabel",
                        "path": "scopedImports/@salesforce-label-LightningPicklist.noneLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMap.coordinatesTitle",
                        "path": "scopedImports/@salesforce-label-LightningMap.coordinatesTitle.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMap.openInGoogleMaps",
                        "path": "scopedImports/@salesforce-label-LightningMap.openInGoogleMaps.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMap.iframeTitle",
                        "path": "scopedImports/@salesforce-label-LightningMap.iframeTitle.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMap.titleWithAddress",
                        "path": "scopedImports/@salesforce-label-LightningMap.titleWithAddress.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMap.defaultTitle",
                        "path": "scopedImports/@salesforce-label-LightningMap.defaultTitle.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveCoordinate.selected",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveCoordinate.selected.js"
                    },
                    {
                        "name": "@salesforce/label/LightningButtonMenu.loading",
                        "path": "scopedImports/@salesforce-label-LightningButtonMenu.loading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningButtonMenu.showMenu",
                        "path": "scopedImports/@salesforce-label-LightningButtonMenu.showMenu.js"
                    },
                    {
                        "name": "@salesforce/label/LightningTabs.overflowMore",
                        "path": "scopedImports/@salesforce-label-LightningTabs.overflowMore.js"
                    },
                    {
                        "name": "@salesforce/label/LightningTabs.overflowMoreTitle",
                        "path": "scopedImports/@salesforce-label-LightningTabs.overflowMoreTitle.js"
                    },
                    {
                        "name": "@salesforce/label/LightningTabs.overflowMoreAlternativeText",
                        "path": "scopedImports/@salesforce-label-LightningTabs.overflowMoreAlternativeText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningTabs.errorStateAlternativeText",
                        "path": "scopedImports/@salesforce-label-LightningTabs.errorStateAlternativeText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningTabs.defaultTabBarAriaLabel",
                        "path": "scopedImports/@salesforce-label-LightningTabs.defaultTabBarAriaLabel.js"
                    },
                    {
                        "name": "@salesforce/label/Duration.secondsLater",
                        "path": "scopedImports/@salesforce-label-Duration.secondsLater.js"
                    },
                    {
                        "name": "@salesforce/label/Duration.secondsAgo",
                        "path": "scopedImports/@salesforce-label-Duration.secondsAgo.js"
                    },
                    {
                        "name": "@salesforce/label/LightningDialog.close",
                        "path": "scopedImports/@salesforce-label-LightningDialog.close.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMessageChannel.publishWithoutContext",
                        "path": "scopedImports/@salesforce-label-LightningMessageChannel.publishWithoutContext.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMessageChannel.invalidScope",
                        "path": "scopedImports/@salesforce-label-LightningMessageChannel.invalidScope.js"
                    },
                    {
                        "name": "@salesforce/label/LightningServiceCloudVoiceToolkitApi.missingNbaParams",
                        "path": "scopedImports/@salesforce-label-LightningServiceCloudVoiceToolkitApi.missingNbaParams.js"
                    },
                    {
                        "name": "@salesforce/label/LightningOutputField.helptextAlternativeText",
                        "path": "scopedImports/@salesforce-label-LightningOutputField.helptextAlternativeText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInput.helptextAlternativeText",
                        "path": "scopedImports/@salesforce-label-LightningInput.helptextAlternativeText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInput.mailingAddressFieldsUpdateText",
                        "path": "scopedImports/@salesforce-label-LightningInput.mailingAddressFieldsUpdateText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRating.readOnlyAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningRating.readOnlyAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRating.selectRating",
                        "path": "scopedImports/@salesforce-label-LightningRating.selectRating.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRating.rating",
                        "path": "scopedImports/@salesforce-label-LightningRating.rating.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRating.oneStar",
                        "path": "scopedImports/@salesforce-label-LightningRating.oneStar.js"
                    },
                    {
                        "name": "@salesforce/label/LightningRating.nStars",
                        "path": "scopedImports/@salesforce-label-LightningRating.nStars.js"
                    },
                    {
                        "name": "@salesforce/label/LightningModalBase.cancelandclose",
                        "path": "scopedImports/@salesforce-label-LightningModalBase.cancelandclose.js"
                    },
                    {
                        "name": "@salesforce/label/LightningModalBase.waitstate",
                        "path": "scopedImports/@salesforce-label-LightningModalBase.waitstate.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInteractiveDialogBase.ok",
                        "path": "scopedImports/@salesforce-label-LightningInteractiveDialogBase.ok.js"
                    },
                    {
                        "name": "@salesforce/label/LightningInteractiveDialogBase.cancel",
                        "path": "scopedImports/@salesforce-label-LightningInteractiveDialogBase.cancel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningAlert.defaultLabel",
                        "path": "scopedImports/@salesforce-label-LightningAlert.defaultLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningConfirm.defaultLabel",
                        "path": "scopedImports/@salesforce-label-LightningConfirm.defaultLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrompt.defaultLabel",
                        "path": "scopedImports/@salesforce-label-LightningPrompt.defaultLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningToast.infoLabel",
                        "path": "scopedImports/@salesforce-label-LightningToast.infoLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningToast.warningLabel",
                        "path": "scopedImports/@salesforce-label-LightningToast.warningLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningToast.successLabel",
                        "path": "scopedImports/@salesforce-label-LightningToast.successLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningToast.errorLabel",
                        "path": "scopedImports/@salesforce-label-LightningToast.errorLabel.js"
                    },
                    {
                        "name": "@salesforce/label/LightningToast.close",
                        "path": "scopedImports/@salesforce-label-LightningToast.close.js"
                    },
                    {
                        "name": "@salesforce/label/LightningToast.macNavigationAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningToast.macNavigationAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningToast.genericNavigationAssistiveText",
                        "path": "scopedImports/@salesforce-label-LightningToast.genericNavigationAssistiveText.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.modalTitle",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.modalTitle.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.firstRuleHeading",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.firstRuleHeading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.otherRuleHeading",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.otherRuleHeading.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.addRule",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.addRule.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.ruleLimit",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.ruleLimit.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.ruleLimitReached",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.ruleLimitReached.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.clearButton",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.clearButton.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.cancelButton",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.cancelButton.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.applyButton",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.applyButton.js"
                    },
                    {
                        "name": "@salesforce/label/LightningMultiColumnSortingModal.duplicateValueValidation",
                        "path": "scopedImports/@salesforce-label-LightningMultiColumnSortingModal.duplicateValueValidation.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveColumnSorter.moveUpTooltip",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveColumnSorter.moveUpTooltip.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveColumnSorter.moveDownTooltip",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveColumnSorter.moveDownTooltip.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveColumnSorter.dropdownPlaceholder",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveColumnSorter.dropdownPlaceholder.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveColumnSorter.ascending",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveColumnSorter.ascending.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveColumnSorter.descending",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveColumnSorter.descending.js"
                    },
                    {
                        "name": "@salesforce/label/LightningPrimitiveColumnSorter.missingValueValidation",
                        "path": "scopedImports/@salesforce-label-LightningPrimitiveColumnSorter.missingValueValidation.js"
                    },
                    {
                        "name": "@salesforce/label/Global_Entity.created_by",
                        "path": "scopedImports/@salesforce-label-Global_Entity.created_by.js"
                    },
                    {
                        "name": "@salesforce/label/Global_Entity.last_modified_by",
                        "path": "scopedImports/@salesforce-label-Global_Entity.last_modified_by.js"
                    },
                    {
                        "name": "@salesforce/label/AddressAutocomplete.LookupButton",
                        "path": "scopedImports/@salesforce-label-AddressAutocomplete.LookupButton.js"
                    },
                    {
                        "name": "@salesforce/i18n/lang",
                        "path": "scopedImports/@salesforce-i18n-lang.js"
                    },
                    {
                        "name": "@salesforce/i18n/dir",
                        "path": "scopedImports/@salesforce-i18n-dir.js"
                    },
                    {
                        "name": "@salesforce/i18n/locale",
                        "path": "scopedImports/@salesforce-i18n-locale.js"
                    },
                    {
                        "name": "@salesforce/i18n/timeZone",
                        "path": "scopedImports/@salesforce-i18n-timeZone.js"
                    },
                    {
                        "name": "@salesforce/i18n/currency",
                        "path": "scopedImports/@salesforce-i18n-currency.js"
                    },
                    {
                        "name": "@salesforce/i18n/firstDayOfWeek",
                        "path": "scopedImports/@salesforce-i18n-firstDayOfWeek.js"
                    },
                    {
                        "name": "@salesforce/i18n/dateTime.shortDateFormat",
                        "path": "scopedImports/@salesforce-i18n-dateTime.shortDateFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/dateTime.mediumDateFormat",
                        "path": "scopedImports/@salesforce-i18n-dateTime.mediumDateFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/dateTime.longDateFormat",
                        "path": "scopedImports/@salesforce-i18n-dateTime.longDateFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/dateTime.shortDateTimeFormat",
                        "path": "scopedImports/@salesforce-i18n-dateTime.shortDateTimeFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/dateTime.mediumDateTimeFormat",
                        "path": "scopedImports/@salesforce-i18n-dateTime.mediumDateTimeFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/dateTime.longDateTimeFormat",
                        "path": "scopedImports/@salesforce-i18n-dateTime.longDateTimeFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/dateTime.shortTimeFormat",
                        "path": "scopedImports/@salesforce-i18n-dateTime.shortTimeFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/dateTime.mediumTimeFormat",
                        "path": "scopedImports/@salesforce-i18n-dateTime.mediumTimeFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.numberFormat",
                        "path": "scopedImports/@salesforce-i18n-number.numberFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.percentFormat",
                        "path": "scopedImports/@salesforce-i18n-number.percentFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.percentSign",
                        "path": "scopedImports/@salesforce-i18n-number.percentSign.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.plusSign",
                        "path": "scopedImports/@salesforce-i18n-number.plusSign.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.minusSign",
                        "path": "scopedImports/@salesforce-i18n-number.minusSign.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.exponentialSign",
                        "path": "scopedImports/@salesforce-i18n-number.exponentialSign.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.superscriptingExponentSign",
                        "path": "scopedImports/@salesforce-i18n-number.superscriptingExponentSign.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.perMilleSign",
                        "path": "scopedImports/@salesforce-i18n-number.perMilleSign.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.infinity",
                        "path": "scopedImports/@salesforce-i18n-number.infinity.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.nan",
                        "path": "scopedImports/@salesforce-i18n-number.nan.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.currencyFormat",
                        "path": "scopedImports/@salesforce-i18n-number.currencyFormat.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.currencySymbol",
                        "path": "scopedImports/@salesforce-i18n-number.currencySymbol.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.groupingSeparator",
                        "path": "scopedImports/@salesforce-i18n-number.groupingSeparator.js"
                    },
                    {
                        "name": "@salesforce/i18n/number.decimalSeparator",
                        "path": "scopedImports/@salesforce-i18n-number.decimalSeparator.js"
                    },
                    {
                        "name": "@salesforce/i18n/showJapaneseCalendar",
                        "path": "scopedImports/@salesforce-i18n-showJapaneseCalendar.js"
                    },
                    {
                        "name": "@salesforce/i18n/common.digits",
                        "path": "scopedImports/@salesforce-i18n-common.digits.js"
                    },
                    {
                        "name": "@salesforce/i18n/common.calendarData",
                        "path": "scopedImports/@salesforce-i18n-common.calendarData.js"
                    },
                    {
                        "name": "@salesforce/i18n/defaultCalendar",
                        "path": "scopedImports/@salesforce-i18n-defaultCalendar.js"
                    },
                    {
                        "name": "@salesforce/i18n/defaultNumberingSystem",
                        "path": "scopedImports/@salesforce-i18n-defaultNumberingSystem.js"
                    },
                    {
                        "name": "@salesforce/i18n/calendarData",
                        "path": "scopedImports/@salesforce-i18n-calendarData.js"
                    },
                    {
                        "name": "@salesforce/client/formFactor",
                        "path": "scopedImports/@salesforce-client-formFactor.js"
                    },
                    {
                        "name": "@salesforce/internal/core.appVersion",
                        "path": "scopedImports/@salesforce-internal-core.appVersion.js"
                    },
                    {
                        "name": "@salesforce/internal/core.securePort",
                        "path": "scopedImports/@salesforce-internal-core.securePort.js"
                    },
                    {
                        "name": "@salesforce/internal/core.untrustedContentDomain",
                        "path": "scopedImports/@salesforce-internal-core.untrustedContentDomain.js"
                    }
                ],
                "ssrRenderedComponents": [
                    "lightning-accordion",
                    "lightning-accordion-section",
                "lightning-avatar",
                "lightning-badge",
                "lightning-base-combobox",
                "lightning-base-combobox-formatted-text",
                "lightning-base-combobox-item",
                "lightning-breadcrumb",
                "lightning-breadcrumbs",
                "lightning-button",
                "lightning-button-group",
                "lightning-button-icon",
                "lightning-button-icon-stateful",
                "lightning-button-menu",
                "lightning-button-stateful",
                "lightning-card",
                "lightning-calendar",
                "lightning-checkbox-group",
                "lightning-color-picker-custom",
                "lightning-color-picker-panel",
                "lightning-combobox",
                "lightning-datepicker",
                "lightning-datetimepicker",
                "lightning-dual-listbox",
                "lightning-dynamic-icon",
                "lightning-file-upload",
                "lightning-focus-trap",
                "lightning-formatted-address",
                "lightning-formatted-date-time",
                "lightning-formatted-email",
                "lightning-formatted-location",
                "lightning-formatted-name",
                "lightning-formatted-number",
                "lightning-formatted-phone",
                "lightning-formatted-text",
                "lightning-formatted-time",
                "lightning-formatted-url",
                "lightning-grouped-combobox",
                "lightning-helptext",
                "lightning-input",
                "lightning-input-address",
                "lightning-input-location",
                "lightning-layout",
                "lightning-layout-item",
                "lightning-lookup-address",
                "lightning-menu-divider",
                "lightning-menu-item",
                "lightning-menu-subheader",
                "lightning-picklist",
                "lightning-pill",
                "lightning-pill-container",
                "lightning-progress-bar",
                "lightning-progress-ring",
                "lightning-primitive-bubble",
                "lightning-primitive-button",
                "lightning-primitive-colorpicker-button",
                "primitive-file-droppable-zone",
                "lightning-primitive-input-checkbox",
                "lightning-primitive-input-checkbox-button",
                "lightning-primitive-input-color",
                "lightning-primitive-input-file",
                "lightning-primitive-input-simple",
                "lightning-primitive-input-toggle",
                "lightning-prompt",
                "lightning-radio-group",
                "lightning-rich-text-toolbar-button",
                "lightning-rich-text-toolbar-button-group",
                "lightning-select",
                "lightning-spinner",
                "lightning-tab",
                "lightning-tab-bar",
                "lightning-tabset",
                "lightning-textarea",
                "lightning-tile",
                "lightning-timepicker",
                "lightning-vertical-navigation",
                "lightning-vertical-navigation-item",
                "lightning-vertical-navigation-item-badge",
                "lightning-vertical-navigation-item-icon",
                "lightning-vertical-navigation-overflow",
                "lightning-vertical-navigation-section"
                ],
                "ssrSafeComponents": [
                    "lightning-alert",
                    "lightning-confirm",
                    "lightning-formatted-rich-text",
                    "lightning-icon",
                    "lightning-input-rich-text",
                    "lightning-interactive-dialog-base",
                    "lightning-modal",
                    "lightning-modal-base",
                    "lightning-modal-body",
                    "lightning-modal-footer",
                    "lightning-modal-header",
                    "lightning-overlay",
                    "lightning-overlay-container",
                    "lightning-popup",
                    "lightning-popup-source",
                    "lightning-primitive-icon",
                    "lightning-primitive-iframe",
                    "lightning-progress-indicator",
                    "lightning-progress-step",
                    "lightning-static-map",
                    "lightning-toast",
                    "lightning-toast-container",
                    "lightning-vertical-navigation",
                    "lightning-vertical-navigation-item",
                    "lightning-vertical-navigation-item-badge",
                    "lightning-vertical-navigation-item-icon",
                    "lightning-vertical-navigation-overflow",
                    "lightning-vertical-navigation-section"
                ],
                "nativeShadowEnabledComponents": [
                    "lightning-accordion",
                    "lightning-accordion-section",
                    "lightning-alert",
                    "lightning-avatar",
                    "lightning-badge",
                    "lightning-base-combobox",
                    "lightning-base-combobox-formatted-text",
                    "lightning-base-combobox-item",
                    "lightning-breadcrumb",
                    "lightning-breadcrumbs",
                    "lightning-bubble",
                    "lightning-button",
                    "lightning-button-group",
                    "lightning-button-icon",
                    "lightning-button-icon-stateful",
                    "lightning-button-menu",
                    "lightning-button-stateful",
                    "lightning-card",
                    "lightning-calendar",
                    "lightning-color-picker-custom",
                    "lightning-color-picker-panel",
                    "lightning-combobox",
                    "lightning-confirm",
                    "lightning-datepicker",
                    "lightning-datetimepicker",
                    "lightning-dual-listbox",
                    "lightning-dynamic-icon",
                    "lightning-file-upload",
                    "lightning-focus-trap",
                    "lightning-formatted-address",
                    "lightning-formatted-date-time",
                    "lightning-formatted-email",
                    "lightning-formatted-location",
                    "lightning-formatted-name",
                    "lightning-formatted-number",
                    "lightning-formatted-phone",
                    "lightning-formatted-rich-text",
                    "lightning-formatted-text",
                    "lightning-formatted-time",
                    "lightning-formatted-url",
                    "lightning-grouped-combobox",
                    "lightning-helptext",
                    "lightning-icon",
                    "lightning-input",
                    "lightning-input-address",
                    "lightning-input-name",
                    "lightning-input-location",
                    "lightning-input-rich-text",
                    "lightning-interactive-dialog-base",
                    "lightning-layout",
                    "lightning-layout-item",
                    "lightning-menu-divider",
                    "lightning-menu-item",
                    "lightning-menu-subheader",
                    "lightning-modal",
                    "lightning-modal-base",
                    "lightning-modal-body",
                    "lightning-modal-footer",
                    "lightning-modal-header",
                    "lightning-overlay",
                    "lightning-overlay-container",
                    "lightning-picklist",
                    "lightning-pill",
                    "lightning-pill-container",
                    "lightning-popup",
                    "lightning-popup-source",
                    "lightning-primitive-bubble",
                    "lightning-primitive-button",
                    "lightning-primitive-color-picker-button",
                    "primitive-file-droppable-zone",
                    "lightning-primitive-icon",
                    "lightning-primitive-input-checkbox",
                    "lightning-primitive-input-checkbox-button",
                    "lightning-primitive-input-color",
                    "lightning-primitive-input-file",
                    "lightning-primitive-input-simple",
                    "lightning-primitive-input-toggle",
                    "lightning-prompt",
                    "lightning-progress-bar",
                    "lightning-progress-indicator",
                    "lightning-progress-ring",
                    "lightning-progress-step",
                    "lightning-radio-group",
                    "lightning-rich-text-toolbar-button",
                    "lightning-rich-text-toolbar-button-group",
                    "lightning-select",
                    "lightning-spinner",
                    "lightning-static-map",
                    "lightning-tab",
                    "lightning-tab-bar",
                    "lightning-tabset",
                    "lightning-toast",
                    "lightning-toast-container",
                    "lightning-tile",
                    "lightning-timepicker",
                    "lightning-vertical-navigation",
                    "lightning-vertical-navigation-item",
                    "lightning-vertical-navigation-item-badge",
                    "lightning-vertical-navigation-item-icon",
                    "lightning-vertical-navigation-overflow",
                    "lightning-vertical-navigation-section"
                ],
                "bestPerformanceTests": [
                    "lightning-accordion",
                    "lightning-breadcrumbs",
                    "lightning-button",
                    "lightning-button-group",
                    "lightning-button-icon",
                    "lightning-button-menu",
                    "lightning-button-stateful",
                    "lightning-card",
                    "lightning-carousel",
                    "lightning-layout",
                    "lightning-pill",
                    "lightning-select",
                    "lightning-tabset",
                    "lightning-tile",
                    "lightning-vertical-navigation",
                    "lightning-ai-form-control",
                    "lightning-ai-layout",
                    "lightning-avatar",
                    "lightning-badge",
                    "lightning-breadcrumb",
                    "lightning-bubble",
                    "lightning-button-icon-stateful",
                    "lightning-checkbox-group",
                    "lightning-click-to-dial",
                    "lightning-combobox",
                    "lightning-datatable",
                    "lightning-datepicker",
                    "lightning-datetimepicker",
                    "lightning-dual-listbox",
                    "lightning-dynamic-icon",
                    "lightning-formatted-address",
                    "lightning-formatted-date-time",
                    "lightning-formatted-email",
                    "lightning-formatted-location",
                    "lightning-formatted-name",
                    "lightning-formatted-number",
                    "lightning-formatted-phone",
                    "lightning-formatted-rich-text",
                    "lightning-formatted-text",
                    "lightning-formatted-time",
                    "lightning-formatted-url",
                    "lightning-grouped-combobox",
                    "lightning-helptext",
                    "lightning-icon",
                    "lightning-input",
                    "lightning-input-address",
                    "lightning-input-location",
                    "lightning-map",
                    "lightning-modal",
                    "lightning-message-service-internal",
                    "lightning-pill-container",
                    "lightning-popup",
                    "lightning-primitive-bubble",
                    "lightning-progress-bar",
                    "lightning-progress-ring",
                    "lightning-radio-group",
                    "lightning-record-picker",
                    "lightning-record-picker-base",
                    "lightning-refresh",
                    "lightning-relative-date-time",
                    "lightning-slider",
                    "lightning-spinner",
                    "lightning-tab-bar",
                    "lightning-textarea",
                    "lightning-timepicker",
                    "lightning-tree",
                    "lightning-tree-grid"
                ],
                "expose": [
                    "lightning/accordion",
                    "lightning/accordionSection",
                    "lightning/alert",
                    "lightning/ariaObserver",
                    "lightning/avatar",
                    "lightning/badge",
                    "lightning/barcodeScanner",
                    "lightning/baseFormattedText",
                    "lightning/breadcrumb",
                    "lightning/breadcrumbs",
                    "lightning/button",
                    "lightning/buttonGroup",
                    "lightning/buttonIcon",
                    "lightning/buttonIconStateful",
                    "lightning/buttonMenu",
                    "lightning/buttonStateful",
                    "lightning/card",
                    "lightning/carousel",
                    "lightning/carouselImage",
                    "lightning/checkboxGroup",
                    "lightning/combobox",
                    "lightning/configProvider",
                    "lightning/confirm",
                    "lightning/context",
                    "lightning/datatable",
                    "lightning/datatableKeyboardMixins",
                    "lightning/dialog",
                    "lightning/dualListbox",
                    "lightning/dynamicIcon",
                    "lightning/f6Controller",
                    "lightning/fileDownload",
                    "lightning/focusTrap",
                    "lightning/formattedAddress",
                    "lightning/formattedDateTime",
                    "lightning/formattedEmail",
                    "lightning/formattedLocation",
                    "lightning/formattedLookup",
                    "lightning/formattedName",
                    "lightning/formattedNumber",
                    "lightning/formattedPhone",
                    "lightning/formattedRichText",
                    "lightning/formattedText",
                    "lightning/formattedTime",
                    "lightning/formattedUrl",
                    "lightning/groupedCombobox",
                    "lightning/helptext",
                    "lightning/i18nCldrOptions",
                    "lightning/i18nService",
                    "lightning/icon",
                    "lightning/iconSvgTemplates",
                    "lightning/iconSvgTemplatesAction",
                    "lightning/iconSvgTemplatesActionRtl",
                    "lightning/iconSvgTemplatesCustom",
                    "lightning/iconSvgTemplatesCustomRtl",
                    "lightning/iconSvgTemplatesDoctype",
                    "lightning/iconSvgTemplatesDoctypeRtl",
                    "lightning/iconSvgTemplatesRtl",
                    "lightning/iconSvgTemplatesStandard",
                    "lightning/iconSvgTemplatesStandardRtl",
                    "lightning/iconSvgTemplatesUtility",
                    "lightning/iconSvgTemplatesUtilityRtl",
                    "lightning/iconUtils",
                    "lightning/input",
                    "lightning/inputAddress",
                    "lightning/inputLocation",
                    "lightning/inputName",
                    "lightning/internalLocalizationService",
                    "lightning/layout",
                    "lightning/layoutItem",
                    "lightning/lookupAddress",
                    "lightning/mediaUtils",
                    "lightning/menuDivider",
                    "lightning/menuItem",
                    "lightning/menuSubheader",
                    "lightning/messageDispatcher",
                    "lightning/modal",
                    "lightning/modalBody",
                    "lightning/modalFooter",
                    "lightning/modalHeader",
                    "lightning/multiColumnSortingModal",
                    "lightning/navigation",
                    "lightning/overlayManager",
                    "lightning/picklist",
                    "lightning/pill",
                    "lightning/pillContainer",
                    "lightning/popup",
                    "lightning/progressBar",
                    "lightning/progressIndicator",
                    "lightning/progressRing",
                    "lightning/progressStep",
                    "lightning/prompt",
                    "lightning/purifyLib",
                    "lightning/radioGroup",
                    "lightning/relativeDateTime",
                    "lightning/routingService",
                    "lightning/select",
                    "lightning/showToastEvent",
                    "lightning/slider",
                    "lightning/spinner",
                    "lightning/stackedTab",
                    "lightning/stackedTabset",
                    "lightning/tab",
                    "lightning/tabset",
                    "lightning/textarea",
                    "lightning/tile",
                    "lightning/toast",
                    "lightning/toastContainer",
                    "lightning/tree",
                    "lightning/treeGrid",
                    "lightning/utils",
                    "lightning/verticalNavigation",
                    "lightning/verticalNavigationItem",
                    "lightning/verticalNavigationItemBadge",
                    "lightning/verticalNavigationItemIcon",
                    "lightning/verticalNavigationOverflow",
                    "lightning/verticalNavigationSection"
                ]
              }),
            args.watch &&
                serve({
                    open: false,
                    port: 3000,
                }),
            args.watch && livereload('dist'),
        ],
    };
};
