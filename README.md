# Google-Forms-AutoSort-and-Notify


1\. Create the Google Form:

-   Add your short answer questions.
-   Add a "File upload" question and set the minimum number of files to 10.
-   Optional: If you want the folder name to include specific answers, add additional short answer questions for those elements.

2\. Write a Google Apps Script:

-   Go to "Tools" > "Script editor" in your Google Form.
-   Paste the code from the script.js file in this repo, modifying it based on your needs:




This Google Apps Script is designed to automate a process associated with a Google Form, particularly one that includes file uploads. Here's a breakdown of what each part of the script does:

### Overview

-   Purpose: The script enhances the functionality of a Google Form by organizing submitted files into specific folders within Google Drive and notifying a recipient via email about the submission.

### Key Components

1.  Constants Definition:

    -   `PARENT_FOLDER_ID`: Stores the ID of the Google Drive folder where temporary folders will be created to initially hold the uploaded files.
    -   `TARGET_SHARED_DRIVE_ID`: Stores the ID of the destination folder (likely within a Shared Drive) where the files will eventually reside.
    -   `EMAIL_ADDRESS`: Stores the email address(es) where notifications about new submissions will be sent. Multiple email addresses can be separated by commas.
2.  `initialize` Function:

    -   This function sets up a trigger that automatically runs the `onFormSubmit` function every time the form is submitted.
3.  `onFormSubmit` Function:

    -   Triggered upon form submission.
    -   Generates a timestamp to uniquely identify the submission.
    -   Calls `buildFolderName` to create a folder name based on the form's responses and the timestamp.
    -   Creates a temporary folder in the designated parent folder to store the uploaded files initially.
    -   Processes each file upload by moving the uploaded files to the temporary folder.
    -   Creates a new folder in the target Shared Drive and copies all files from the temporary folder to this new location.
    -   Sends an email notification to the specified email address(es) with a link to the folder in the Shared Drive containing the uploaded files.
    -   Optionally deletes the temporary folder to clean up the Google Drive space.
4.  `buildFolderName` Function:

    -   Constructs a folder name using the timestamp, a status (e.g., "Pending"), and the concatenated responses from the form. It excludes file upload responses to avoid appending file IDs to the folder name.
    -   Filters responses to handle only text-based answers (ignoring file uploads) and concatenates them with underscores, providing a structured and informative folder name.

### Process Flow

1.  Initialization: When the script is first set up, running `initialize()` creates a trigger for the form submission.
2.  Form Submission: Each time the form is submitted, `onFormSubmit` is invoked.
3.  Temporary Storage: Uploaded files are first moved to a temporary folder.
4.  Permanent Storage: Files are then copied to a more permanent location in a Shared Drive.
5.  Notification: An email is sent out with the details of the submission and a link to the files.
6.  Cleanup: The temporary folder can be deleted to maintain a clean Drive environment.

### Error Handling

-   The script includes basic error logging using `try-catch` blocks. If any part of the `onFormSubmit` process fails, the error is logged for troubleshooting.

### Customization Points

-   Folder naming via `buildFolderName` can be customized based on form structure and needs.
-   Email content and recipient(s) can be easily adjusted.
-   The script can be extended to include additional logic, such as more detailed error handling, conditional processing based on form responses, or integration with other Google services (e.g., Sheets for logging submissions).

This script effectively streamlines the handling of form submissions with file uploads, organizing them into designated folders and notifying relevant stakeholders, all automated to save time and reduce manual file management tasks.

created by [John Seargeant](https://github.com/John-Sarge) with a little help from GPT and Bard.  03Feb2024
