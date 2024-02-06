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
