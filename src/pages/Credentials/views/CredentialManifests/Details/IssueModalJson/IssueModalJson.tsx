import { Component, JSX, createSignal, onCleanup } from "solid-js";
import "./IssueModalJson.scss";
import Icon, { ArrowUpDown, Beaker, DangerAlert, XCross } from "../../../../../../icons/Icon";
import { formatTextAreaOnKeyDown, insertSampleInput, renderFormFromJSON, submitForm, updateFormOnInput } from "../../../../../../utils/helpers";
import { credentialInputJson } from "./samples/mock";

const IssueModal: Component<{ content }> = (props) => {
    //pass in these props
    let endpoint = '/v1/credentials';
    let method = 'POST';

    let initialFormValues = { json: '' }

    // the component
    
    const [formValues, setFormValues] = createSignal(initialFormValues);
    const [isLoading, setIsLoading] = createSignal(false);
    const [isSuccess, setIsSuccess] = createSignal(false);
    const [isError, setIsError] = createSignal(false);

    const resetForm = () => {
        setFormValues(initialFormValues);
        setIsLoading(false);
        setIsSuccess(false);
        setIsError(false);
    }

    //dialog magic
    let dialog;
    const showModal = () => {
        dialog.showModal();
        document.body.classList.add('no-scroll');
        dialog.addEventListener('close', () => {
            document.body.classList.remove('no-scroll');
            resetForm();
        });
    }
    
    const closeModal = () => {
        return dialog.close();
    }

    //actual form calls
    const handleSubmit = async (event) => {
        const request = { endpoint, method, body: JSON.stringify(formValues()) };
        const setters = { setIsLoading, setIsSuccess, setIsError };
        submitForm(event, setters, request);
    };

    const handleInput = (event) => {
        updateFormOnInput(event, { setIsError, setFormValues })
    };

    const handleKeyDown = (event) => {
        formatTextAreaOnKeyDown(event, { setFormValues });
    }

    const isFormValid = () => {
        return formValues().json.trim() !== '' && !isError();
    }

    //populate textarea field with sample input
    const populateSampleInput = (event) => {
        const setters = { setIsError, setFormValues };
        insertSampleInput(event, setters, 'json', credentialInputJson);
    }

    return (
        <>
            <button class={props.content.button.className} onclick={showModal}>
                {props.content.button.label}
            </button>
            <dialog class="dialog" ref={dialog}>
                <div class="dialog-header">
                    <button title="Close dialog" onClick={closeModal}>
                        <Icon svg={XCross} />
                    </button>
                </div>

                <div class="dialog-body">
                    <h2>Issue Verifiable Credential</h2>
                    <form onSubmit={handleSubmit}>
                        {!isLoading() && !isSuccess() && (
                            <>
                                {isError() && 
                                    <div class="banner banner-danger">
                                        <Icon svg={DangerAlert} />
                                        Error issuing credential. Try again
                                    </div> 
                                }
                                <div class="field-container">
                                    <label for="json">JSON</label>
                                    <div class="textarea-container">
                                        <textarea 
                                            id="json" 
                                            name="json" 
                                            value={formValues().json} 
                                            onInput={handleInput}
                                            onkeydown={handleKeyDown}
                                            spellcheck={false}
                                            autocomplete="off"
                                            rows={3}
                                            required
                                        />
                                        <button class="tiny-ghost-button" onclick={populateSampleInput}>
                                            <Icon svg={Beaker} />
                                            Try sample input
                                        </button>
                                    </div>
                                </div>
                                {/* {renderFormFromJSON(manifestInput.outputDescriptors[0], { setFormValues })} */}
                                <div class="button-row">
                                    <button class="secondary-button" type="button" onClick={() => dialog.close()}>
                                        Cancel
                                    </button>
                                    <button class="primary-button" type="submit" disabled={!isFormValid()}>
                                        Submit
                                    </button>
                                </div>
                            </>
                        )}

                        {isLoading() && <div>Loading...</div>}
                        
                        {isSuccess() && (
                            <>
                                <div class="banner banner-success">
                                    🎉 Success - Credential ID 12345-134546-1232456
                                </div>
                                <div class="button-row"> 
                                    <button class="secondary-button" type="button" onClick={closeModal}>
                                        Done
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </dialog>
        </>
    )
}

export default IssueModal;