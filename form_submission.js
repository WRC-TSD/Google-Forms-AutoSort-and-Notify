// Constants for configuration
const TARGET_SHARED_DRIVE_ID = 'Target shared drive ID'; // Specifies the ID of the target shared drive where folders will be created.
const EMAIL_ADDRESS = 'email address here, for multiple separate with a comma'; // Defines the recipient(s) for the notification email.

// Exclusions for naming and email content
const EXCLUDE_FROM_FOLDER_NAME = [
  "Question 1 Title", 
  "Question 6 Title", 
  "Question 7 Title", 
  "Question 8 Title"
]; // Lists the titles of form questions whose answers should be excluded from the generated folder name.
const EXCLUDE_FROM_EMAIL_BODY = [
  "Question 5 Title"
]; // Lists the titles of form questions whose answers should be excluded from the email body.

// Initializes the script by creating a trigger for form submission
function initialize() {
  const form = FormApp.getActiveForm(); // Retrieves the current Google Form.
  ScriptApp.newTrigger('onFormSubmit') // Initiates the creation of a new trigger.
    .forForm(form) // Specifies that the trigger is for the current form.
    .onFormSubmit() // Sets the trigger to activate upon form submission.
    .create(); // Completes the creation of the trigger.
}

// Handles form submission
function onFormSubmit(e) {
  try {
    const timestamp = Utilities.formatDate(new Date(), "America/New_York", "yyyyMMdd-HHmm"); // Generates a timestamp for the submission.
    const folderName = buildFolderName(e.response.getItemResponses(), timestamp); // Builds a folder name based on the submission.
    
    const sharedDriveFolder = DriveApp.getFolderById(TARGET_SHARED_DRIVE_ID).createFolder(folderName); // Creates a new folder in the shared drive.
    Logger.log("Shared drive folder created: " + folderName); // Logs the creation of the folder.

    moveUploadedFiles(e.response.getItemResponses(), sharedDriveFolder); // Moves uploaded files to the new folder.

    sendEmail(e.response, sharedDriveFolder, folderName); // Sends a notification email about the submission.
  } catch (error) {
    Logger.log("Error: " + error.toString()); // Logs any errors that occur during the process.
  }
}

// Builds the folder name based on form responses and timestamp, excluding file uploads and specific titles
function buildFolderName(itemResponses, timestamp) {
  let parts = itemResponses
    .filter(response => response.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD && !EXCLUDE_FROM_FOLDER_NAME.includes(response.getItem().getTitle()))
    .map(response => {
      let answer = response.getResponse();
      return Array.isArray(answer) ? answer.join(", ") : answer.toString();
    });
  return timestamp + "_" + "PENDING" + "_" + parts.join("_"); // Constructs the folder name from the timestamp, a "PENDING" status, and the filtered responses.
}

// Moves uploaded files directly to the shared drive folder using their IDs
function moveUploadedFiles(itemResponses, sharedDriveFolder) {
  itemResponses
    .filter(itemResponse => itemResponse.getItem().getType() === FormApp.ItemType.FILE_UPLOAD)
    .forEach(itemResponse => {
      const fileIds = itemResponse.getResponse(); // Retrieves file IDs from the submission.
      fileIds.forEach(fileId => {
        const file = DriveApp.getFileById(fileId); // Gets the file from Google Drive.
        try {
          file.moveTo(sharedDriveFolder); // Moves the file to the new folder.
          Logger.log("File moved to shared drive folder: " + file.getName()); // Logs the move.
        } catch (error) {
          Logger.log("Error moving file to shared drive folder: " + error.toString()); // Logs any errors.
        }
      });
    });
}

// Builds and sends the email with details of the form submission, excluding file uploads and specific titles
function sendEmail(response, sharedDriveFolder, folderName) {
  let emailBody = `<strong>Google Drive Folder containing the order documents:</strong> <a href="${sharedDriveFolder.getUrl()}">${sharedDriveFolder.getUrl()}</a><br/><br/>`; // Starts the email body with a link to the shared folder.
  response.getItemResponses().forEach(itemResponse => {
    if (itemResponse.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD && !EXCLUDE_FROM_EMAIL_BODY.includes(itemResponse.getItem().getTitle())) {
      const questionTitle = itemResponse.getItem().getTitle(); // Gets the question title.
      const response = itemResponse.getResponse(); // Gets the response.
      emailBody += `<strong>${questionTitle}:</strong> ${Array.isArray(response) ? response.join(", ") : response}<br/><br/>`; // Adds the question and response to the email body.
    }
  });

  MailApp.sendEmail({
    to: EMAIL_ADDRESS, // Sets the recipient(s).
    subject: "WRC Order Submission: " + folderName, // Sets the email subject.
    htmlBody: emailBody // Sets the email body.
  });
}
