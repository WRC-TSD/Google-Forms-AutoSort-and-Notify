# Google-Forms-AutoSort-and-Notify


1\. Create the Google Form:

-   Add your short answer questions.
-   Add a "File upload" question and set the minimum number of files to 10.
-   Optional: If you want the folder name to include specific answers, add additional short answer questions for those elements.

2\. Write a Google Apps Script:

-   Go to "Tools" > "Script editor" in your Google Form.
-   Paste the code from the script.js file in this repo, modifying it based on your needs:




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

created by [John Seargeant](https://github.com/John-Sarge) with a little help from GPT and Bard.  03Feb2024
