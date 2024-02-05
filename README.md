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

This script is designed to organize subfolders within a Google Drive folder based on predefined criteria, utilizing Google Apps Script, a JavaScript-based platform that allows for the automation of tasks within Google's suite of products. The script consists of several functions, each with a specific role in the organization process. Here's a detailed breakdown of its components and how they work together:

### Entry Point: `organizeSubfolders()`

-   Purpose: Serves as the starting point for the organization process.
-   Process:
    -   Specifies the ID of the parent folder to be organized.
    -   Retrieves this folder using the `DriveApp.getFolderById()` method.
    -   Initiates the recursive scanning and organization process by calling `scanAndOrganizeSubfolders()`, passing the parent folder as both the folder to scan and the base folder to keep track of the original parent.

### Main Logic: `scanAndOrganizeSubfolders(folder, baseParentFolder)`

-   Purpose: Recursively scans through all subfolders of the given folder, organizing them according to predefined sorting words found in their names.
-   Process:
    -   Defines sorting criteria using an array of keywords (`["SENT", "HOLD", "COMPLETE"]`).
    -   Iterates through all subfolders, checking if their names match the sorting criteria (based on the presence of sorting words).
    -   For folders matching the criteria, it checks if the folder is already sorted correctly. If not, it creates the necessary folder structure and moves the folder to its correct location.
    -   This function calls itself recursively to ensure that all levels of subfolders are organized.

### Helper Functions:

-   `isSubfolderAlreadySorted(subfolder, baseParentFolder, expectedParentFolderName, month)`: Checks if a subfolder is already in its correct location to avoid unnecessary moves.
-   `moveSubfolder(subfolder, newParentFolder)`: Moves a subfolder, including all its contents, to a new location. This involves creating a new folder in the target location, copying all files and subfolders to the new folder, and then trashing the original folder.
-   `createSubfolders(folder, subfolderPath)`: Ensures the necessary folder structure exists for organizing a subfolder. It creates any missing folders along the specified path.
-   `findOrCreateFolder(parentFolder, folderName)`: Searches for a folder by name under a specified parent folder. If the folder doesn't exist, it creates and returns a new folder.

### Trigger Setup: `createTrigger()`

-   Purpose: Automatically schedules the `organizeSubfolders` function to run at a set interval (every 15 minutes in this case).
-   Process: Uses the `ScriptApp.newTrigger()` method to create a time-based trigger.

### Key Concepts:

-   Recursion: The script uses recursion to navigate through all levels of subfolders, allowing it to organize deeply nested folders.
-   Folder Organization Strategy: Folders are organized based on keywords found in their names, and this organization involves creating a hierarchical structure based on those keywords and potentially the date encoded in the folder name.
-   Google Apps Script Services: The script leverages various Google Apps Script services such as `DriveApp` for manipulating Google Drive items and `ScriptApp` for creating triggers.

This script is particularly useful for automating the process of keeping a large and potentially deeply nested folder structure organized according to specific criteria, improving navigability and management of files within Google Drive.

created by [John Seargeant](https://github.com/John-Sarge) with a little help from GPT and Bard.  03Feb2024
