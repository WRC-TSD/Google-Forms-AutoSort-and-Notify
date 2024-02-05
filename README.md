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

This Google Apps Script is designed to automate the organization of subfolders within a Google Drive folder. It uses specific naming conventions to sort subfolders into categorized subfolders based on predefined keywords. Here's a breakdown of its functionality and how each part of the code contributes to the overall process:

### `organizeSubfolders()`

-   Purpose: Serves as the entry point of the script. It initializes the process by identifying the parent folder in Google Drive using its folder ID and then starts the recursive scanning and organization process by calling `scanAndOrganizeSubfolders` with the parent folder as both the current folder to scan and the base folder for organization.
-   Key Actions:
    -   Retrieves the parent folder from Google Drive using `DriveApp.getFolderById(folderId)`.
    -   Calls `scanAndOrganizeSubfolders`, passing it the parent folder twice: once as the folder to scan and once as the base for organizing subfolders. This ensures that the organization process always has a reference to the top-level folder where the sorted subfolders should be placed.

### `scanAndOrganizeSubfolders(folder, baseParentFolder)`

-   Purpose: Recursively scans through all subfolders, starting from a specified folder, and organizes them based on predefined sorting words (`"SENT"`, `"HOLD"`, `"COMPLETE"`). It uses the base parent folder to maintain a consistent organization structure at the root level.
-   Key Actions:
    -   Iterates through all subfolders of the given folder.
    -   Splits the name of each subfolder to analyze its components, checking for a match with predefined sorting words.
    -   If a match is found and the folder name includes a valid date string, it constructs a new path for organizing this subfolder and calls `createSubfolders` to ensure the path exists within the base parent folder.
    -   Moves the matching subfolder to the newly created or existing path using `moveSubfolder`.
    -   Recursively calls itself for each subfolder, allowing the script to scan and organize subfolders at all levels of the hierarchy.

### `moveSubfolder(subfolder, newParentFolder)`

-   Purpose: Moves a specified subfolder, including all its files and sub-subfolders, into a new parent folder. It then trashes the original subfolder after moving its contents.
-   Key Actions:
    -   Creates a new subfolder under the new parent folder with the same name as the original.
    -   Copies all files from the original subfolder to the new subfolder.
    -   Recursively handles all sub-subfolders using the same process, ensuring a complete move.
    -   Sets the original subfolder to be trashed, effectively removing it from its previous location.

### `createSubfolders(folder, subfolderPath)`

-   Purpose: Creates a nested folder structure based on a given path, starting from a specified base folder. If any part of the path already exists, it reuses the existing folders; otherwise, it creates new ones.
-   Key Actions:
    -   Splits the `subfolderPath` into its components and iteratively checks for the existence of each subfolder in the path.
    -   If a subfolder does not exist, it is created under the current level. This process ensures the desired folder hierarchy is established within the base folder.

### `findOrCreateFolder(parentFolder, folderName)`

-   Purpose: Checks if a folder with a given name exists under a specified parent folder. If it exists, the folder is returned; otherwise, a new folder with that name is created.
-   Key Actions:
    -   Searches for a folder by name under the given parent folder.
    -   Returns the folder if found; otherwise, creates and returns a new folder with the specified name.

### `createTrigger()`

-   Purpose: Sets up an automatic trigger that runs the `organizeSubfolders` function every 5 minutes, ensuring the folder organization process is regularly executed without manual intervention.
-   Key Actions:
    -   Uses Google Apps Script's `ScriptApp.newTrigger` method to create a time-based trigger for the `organizeSubfolders` function.

### Summary

This script automates the organization of subfolders in Google Drive by sorting them into categories based on their names. It leverages recursive scanning to ensure all levels of folders are organized, and it maintains a consistent structure by always referring to a base parent folder for the placement of sorted subfolders. The script is designed for efficiency and scalability, ensuring that even as new subfolders are added or existing ones are renamed, they are automatically sorted into the correct categories.

created by [John Seargeant](https://github.com/John-Sarge) with a little help from GPT and Bard.  03Feb2024
