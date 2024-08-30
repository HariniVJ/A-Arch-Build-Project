import React from 'react';

function CreateInspectionForm() {
    return (
        <div>
            <h2>Create Inspection</h2>
            <form>
                {/* Your form fields go here */}
                <label>
                    Inspection Date:
                    <input type="date" name="date" />
                </label>
                <br />
                <label>
                    Description:
                    <textarea name="description"></textarea>
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateInspectionForm;
