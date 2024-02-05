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

The given Google Drive App Script is designed to automate the organization of subfolders within a specified parent folder on Google Drive based on predefined sorting criteria. Here's a breakdown of its functionality:

### Main Function: `organizeSubfolders()`

1.  Initialization: It starts with defining a `folderId` for the parent folder and a list of `sortingWords` that are used to categorize subfolders.
2.  Subfolder Sorting and Organizing:
    -   Retrieves all subfolders within the specified parent folder.
    -   Iterates through each subfolder, examining its name which is expected to follow a specific naming convention (e.g., "date_word_otherinfo" where "word" is one of the `sortingWords`).
    -   If a subfolder's name matches the expected format and contains one of the `sortingWords`, it further processes this subfolder.
    -   Assumes the subfolder's name starts with a date in "yyMMddHHmm" format, validates this, and extracts the month part of the date.
    -   Constructs a new path for the subfolder based on the sorting word and the month extracted from the subfolder's name.
    -   Creates the necessary subfolder structure within the parent folder based on this new path and moves the subfolder to its new location.

### Supporting Functions

-   `moveSubfolder(subfolder, newParentFolder)`: This function is responsible for moving a subfolder (along with all its files and sub-subfolders) to a new parent folder. It copies all files to the new location, recursively moves sub-subfolders, and then trashes the original subfolder.

-   `createSubfolders(folder, subfolderPath)`: Creates the necessary hierarchy of subfolders within a specified parent folder based on a given path. It ensures that each level of the folder structure exists, creating new subfolders as necessary.

-   `findOrCreateFolder(parentFolder, folderName)`: Looks for a subfolder by name within a given parent folder. If the subfolder exists, it is returned; otherwise, a new subfolder with the specified name is created and returned.

-   `createTrigger()`: Sets up a time-based trigger that automatically executes the `organizeSubfolders` function every 5 minutes. This ensures that the folder organization process runs automatically at regular intervals without manual intervention.

### Process Flow

1.  Organization:
    -   Subfolders are sorted and reorganized based on specific keywords found in their names and the month extracted from the date portion of their names.
2.  Automation:
    -   The script includes a mechanism for automatic execution, ensuring that the organization process is maintained continuously without requiring manual triggers.

This script effectively automates the management of files and folders within a Google Drive, making it easier to keep a large number of items neatly organized according to specified criteria.

created by [John Seargeant](https://github.com/John-Sarge) with a little help from GPT and Bard.  03Feb2024
