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


This Google Apps Script is designed to automate the handling of submissions from a Google Form. It consists of several key components that work together to create a folder in a specified Google Drive (specifically, a Shared Drive), move any uploaded files to this newly created folder, and then notify designated recipients via email about the submission details. Here's a detailed breakdown of its functionality:

### Constants for Configuration

-   `TARGET_SHARED_DRIVE_ID`: This is the unique identifier for the target shared drive where the script will create a new folder for each form submission.
-   `EMAIL_ADDRESS`: Specifies the email addresses of the recipients who should receive notifications about each form submission. Multiple email addresses can be separated by commas.
-   `EXCLUDE_FROM_FOLDER_NAME`: An array containing titles of form questions that should not be included in the folder name. This is useful for omitting irrelevant or sensitive information.
-   `EXCLUDE_FROM_EMAIL_BODY`: Similar to `EXCLUDE_FROM_FOLDER_NAME`, this array lists titles of form questions whose answers should be excluded from the body of the notification email.

### `initialize` Function

This function sets up a trigger for the Google Form that executes the `onFormSubmit` function whenever a new form submission is made. It does this by accessing the current form, creating a new trigger, and specifying that the trigger should listen for form submissions.

### `onFormSubmit` Function

This is the main function that handles a form submission. It performs several tasks:

-   Timestamp Generation: It generates a timestamp in a specific format to help timestamp the submission and uses this as part of the folder naming convention.
-   Folder Creation: Utilizing the timestamp and responses from the form, it creates a unique folder name and then creates this folder within the specified shared drive.
-   File Moving: If any files were uploaded as part of the form submission, it moves these files from their original location to the newly created folder in the shared drive.
-   Email Notification: It constructs an email with details about the form submission, excluding specified information, and sends this to the configured email address(es).

### `buildFolderName` Function

This function constructs a folder name based on the responses to the form submission, excluding any responses from questions listed in `EXCLUDE_FROM_FOLDER_NAME` and file uploads. It combines these filtered responses with a timestamp and a "PENDING" status to create a unique folder name.

### `moveUploadedFiles` Function

This function is responsible for moving any files uploaded through the form to the newly created folder in the shared drive. It filters the item responses to find file uploads, retrieves the file IDs, and then moves each file to the target folder, logging the process.

### `sendEmail` Function

This function constructs and sends an email notification about the form submission. The email includes a link to the newly created folder in the shared drive and details of the form submission, excluding any responses from questions listed in `EXCLUDE_FROM_EMAIL_BODY` and file uploads. The function uses HTML formatting to structure the email content, ensuring that the email is both informative and visually organized.

Overall, this script automates the process of organizing form submissions into a structured format within a shared drive and notifies relevant parties about the submission, thereby enhancing efficiency and managing submissions effectively.

# Google-Drive-Sorting-Script

This Google Drive App Script is designed to automate the organization of subfolders within a specific Google Drive folder. It utilizes Google Apps Script, a JavaScript cloud scripting language that provides easy ways to automate tasks across Google products and third party services. The script sorts subfolders based on predefined criteria found in the subfolder names, then moves them into a structured folder hierarchy. Below is a detailed explanation of each part of the script:

### Entry Point: `organizeSubfolders()`

-   Purpose: This function serves as the entry point of the script. It specifies the folder to be organized and initiates the organization process.
-   How it works: It starts by defining a `folderId` which is the ID of the Google Drive folder you want to organize. Then, it retrieves this folder as a `parentFolder` object using `DriveApp.getFolderById(folderId)`. Finally, it calls `scanAndOrganizeSubfolders(parentFolder, parentFolder)` to begin organizing the folder's contents.

### Core Functionality: `scanAndOrganizeSubfolders(folder, baseParentFolder)`

-   Purpose: To recursively scan through all subfolders of the given folder, organizing them based on predefined criteria.
-   How it works: This function goes through each subfolder, checking if the subfolder name matches the predefined sorting criteria (e.g., specific keywords). If a match is found and the subfolder isn't already organized correctly, it moves the subfolder into the appropriate location within a structured hierarchy based on the sorting words and the date string extracted from the subfolder name.

### Helper Functions:

1.  `isSubfolderAlreadySorted(subfolder, baseParentFolder, expectedParentFolderName, month)`

    -   Purpose: Checks if the subfolder is already in the correct location to avoid unnecessary moves.
    -   How it works: It looks for the expected parent folder and month subfolder within the `baseParentFolder`. If the subfolder's current parent matches the expected location, it returns true; otherwise, false.
2.  `moveSubfolder(subfolder, newParentFolder)`

    -   Purpose: Moves the subfolder, including all its contents, to a new parent folder.
    -   How it works: It creates a new subfolder under the `newParentFolder` with the same name as the original subfolder, moves all files and sub-subfolders to this new subfolder, and finally trashes the original subfolder.
3.  `createSubfolders(folder, subfolderPath)`

    -   Purpose: Ensures the necessary folder structure exists within the `baseParentFolder` based on a given path.
    -   How it works: It iteratively checks for the existence of each subfolder in the path, creating any that don't exist, and navigates down the folder hierarchy to the final folder in the path.
4.  `findOrCreateFolder(parentFolder, folderName)`

    -   Purpose: Finds or creates a subfolder by name under a specified parent folder.
    -   How it works: It searches for a folder by name under the `parentFolder`. If the folder exists, it returns this folder; if not, it creates a new folder with the specified name.

### Automation Trigger: `createTrigger()`

-   Purpose: To set up an automatic trigger that runs the `organizeSubfolders` function periodically.
-   How it works: It creates a new time-based trigger using `ScriptApp.newTrigger("organizeSubfolders")` that executes the `organizeSubfolders` function every 15 minutes.

### Summary

The script efficiently organizes folders in Google Drive by sorting them into a predefined hierarchy based on their names, specifically looking for sorting keywords and date strings. It is recursive, ensuring even nested folders are organized. This can greatly enhance file management, especially for users dealing with a large number of folders that follow a consistent naming convention. The script also demonstrates the power of Google Apps Script for automating repetitive tasks within Google Drive, saving time and reducing the potential for human error.

created by [John Seargeant](https://github.com/John-Sarge) with a little help from GPT and Bard.  03Feb2024
