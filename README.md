# Google-Forms-Submission-Script (the sorting part is further down this readme)

This was made to automate some of the work we were doing in processing purchase orders. The main purpose was to minimize the moving of the purchase documents and have them go straight to our purchasing folder in our Google Share Drive.
Be advised, Google Forms cannot have file upload options when they are created/stored on a Shared Drive. Create the form on your personal/work drive.

1\. Create the Google Form:

-   The script will create the folder name in the order the questions on the form are in.
-   Add your short answer questions.
-   Add a "File upload" question and set the minimum number of files to 10.
-   I advise that you test the form once and upload a test file so that way you can get the original upload folder location.

2\. Write a Google Apps Script:

-   Go to "Tools" > "Script editor" in your Google Form.
-   Paste the code from the form_submission.js file in this repo, modifying it based on your needs, then save it.
-   Add a new trigger, for "Choose which function to run" select "onFormSubmit", for "Select event type" select "On form submit".
-   At some point it will ask for authorization, accept all.
-   Test your form!




This Google Apps Script is designed to automate the process of handling responses from a Google Form, particularly focusing on forms that include file uploads. The script integrates with Google Drive and Email services to organize submitted files into designated folders and notify relevant parties via email. Here's a detailed breakdown of its components and functionality:

### Variables

-   PARENT_FOLDER_ID: The ID of the Google Drive folder where temporary folders for new submissions will be created.
-   TARGET_SHARED_DRIVE_ID: The ID of the target shared drive (or folder) where the final copies of the submissions will be stored.
-   EMAIL_ADDRESS: The email address(es) to which notifications about new submissions will be sent. Multiple email addresses can be separated by commas.
-   EXCLUDE_FROM_FOLDER_NAME: Titles of form questions whose answers should not be included in the names of the folders created for new submissions.
-   EXCLUDE_FROM_EMAIL_BODY: Titles of form questions that should not be included in the email notification body.

### `initialize` Function

This function sets up a trigger for the Google Form, so that the `onFormSubmit` function is called automatically whenever a new form submission is received.

### `onFormSubmit` Function

This is the main function that handles a new form submission. It performs several tasks:

1.  Timestamp Creation: Generates a timestamp string to uniquely identify the submission.
2.  Folder Name Generation: Builds a folder name based on the form responses and the timestamp, excluding specific question responses as defined.
3.  Temporary Folder Creation: Creates a temporary folder in the original drive using the generated folder name.
4.  File Processing: Processes file uploads from the form submission, moving each file to the temporary folder.
5.  Shared Drive Folder Creation: Creates a new folder in the target shared drive with the same name as the temporary folder.
6.  File Copying: Copies all files from the temporary folder to the new folder in the shared drive.
7.  Email Body Building: Constructs an HTML-formatted email body containing a link to the shared drive folder and summaries of the form responses, excluding file uploads and certain questions.
8.  Email Notification: Sends an email with the constructed body, subject, and recipient(s) specified.
9.  Temporary Folder Deletion: Optionally deletes the temporary folder to clean up the original drive.

### `buildFolderName` Function

This helper function constructs a folder name for the submission. It includes the timestamp, a fixed "Pending" label, and selected form responses (excluding those specified to be omitted and file uploads). The responses are concatenated to form a unique identifier for each submission.

### Error Handling

The `onFormSubmit` function includes a `try-catch` block to gracefully handle any errors that occur during execution. Errors are logged using Google's Logger service.

### Overall Workflow

1.  Initialization: When the script is first run, it initializes a form submission trigger.
2.  Form Submission: Upon receiving a form submission, the script automatically executes the `onFormSubmit` function.
3.  Processing and Notification: The script processes the submission by organizing files into folders on Google Drive and notifies relevant parties via email with details of the submission and links to the documents.

This script is a comprehensive solution for managing file uploads through Google Forms, automating the process of file organization, and communication with stakeholders. It leverages Google Apps Script's integration with Google Drive and Gmail to streamline workflows involving form submissions.

# Google-Drive-Sorting-Script

This Google Apps Script is designed to work with Google Forms, specifically for automating the process of organizing form submissions into a shared Google Drive and notifying via email. Here's a breakdown of the script, including a detailed explanation of its components and functionality:

### Script Configuration Constants

-   `TARGET_SHARED_DRIVE_ID`: This is the unique identifier for the target shared drive where a new folder will be created for each form submission.
-   `EMAIL_ADDRESS`: The email address(es) to which notifications about the form submission will be sent. Multiple addresses can be separated by commas.
-   `EXCLUDE_FROM_FOLDER_NAME` and `EXCLUDE_FROM_EMAIL_BODY`: These arrays define which form questions should be excluded from the folder name and the email body, respectively.

### `initialize` Function

This function sets up the script to run automatically when a form is submitted. It does so by creating a trigger that calls the `onFormSubmit` function whenever the associated Google Form receives a submission.

### `onFormSubmit` Function

This is the main function that handles form submissions. It performs several tasks:

1.  Timestamp Generation: Creates a timestamp in the format `yyyyMMdd-HHmm` based on the current date and time.
2.  Folder Name Creation: Calls `buildFolderName` to construct a folder name based on form responses, excluding specified questions and adding the timestamp.
3.  Folder Creation in Shared Drive: Creates a new folder in the designated shared drive using the constructed name.
4.  File Moving: Calls `moveUploadedFiles` to move any files uploaded through the form into the newly created shared drive folder.
5.  Email Notification: Sends an email with details of the form submission and a link to the shared drive folder by calling `sendEmail`.

### `buildFolderName` Function

This function generates a folder name by concatenating form responses, excluding responses from file upload questions and any questions specified in `EXCLUDE_FROM_FOLDER_NAME`. It includes the timestamp for uniqueness.

### `moveUploadedFiles` Function

This function iterates over form responses, identifies file uploads, and moves these files to the specified shared drive folder. It handles errors that might occur during the file move operation.

### `sendEmail` Function

This function constructs and sends an email to the specified recipient(s). The email contains a link to the shared drive folder and details from the form submission, excluding file uploads and responses from questions specified in `EXCLUDE_FROM_EMAIL_BODY`.

### Error Handling

Both `onFormSubmit` and `moveUploadedFiles` functions include try-catch blocks for error handling, logging any errors that occur during their execution. This is crucial for debugging and ensuring the script runs smoothly without breaking on unexpected input or issues.

### Summary

This script automates the process of handling Google Form submissions by organizing submitted data and files into a structured format within a shared Google Drive and notifying relevant parties via email. It effectively streamlines workflow processes, particularly for scenarios like order submissions, survey responses, or any form-based data collection that requires organized storage and notification.

created by [John Seargeant](https://github.com/John-Sarge) with a little help from GPT and Bard.  03Feb2024
