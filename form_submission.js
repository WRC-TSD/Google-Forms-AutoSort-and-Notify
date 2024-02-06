// Constants for configuration
const TARGET_SHARED_DRIVE_ID = 'Target shared drive ID'; // Target shared drive ID where the final folder will be created
const EMAIL_ADDRESS = 'email address here, for multiple separate with a comma'; // Recipient(s) email address(es)

// Exclusions for naming and email content
const EXCLUDE_FROM_FOLDER_NAME = [
  "Question 1 Title", 
  "Question 6 Title", 
  "Question 7 Title", 
  "Question 8 Title"
]; // Titles of form questions to exclude from the folder name
const EXCLUDE_FROM_EMAIL_BODY = [
  "Question 5 Title"
]; // Titles of form questions to exclude from the email body

// Initializes the script by creating a trigger for form submission
function initialize() {
  const form = FormApp.getActiveForm(); // Gets the current Google Form
  ScriptApp.newTrigger('onFormSubmit') // Creates a new trigger
    .forForm(form) // Associates the trigger with the current form
    .onFormSubmit() // Sets the trigger to fire on form submission
    .create(); // Finalizes and creates the trigger
}

// Handles form submission
function onFormSubmit(e) {
  try {
    const timestamp = Utilities.formatDate(new Date(), "America/New_York", "yyyyMMdd-HHmm"); // Generates a timestamp for uniqueness
    const folderName = buildFolderName(e.response.getItemResponses(), timestamp); // Builds a folder name based on form responses
    
    // Creates a new folder in the shared drive with the constructed folder name
    const sharedDriveFolder = DriveApp.getFolderById(TARGET_SHARED_DRIVE_ID).createFolder(folderName);
    Logger.log("Shared drive folder created: " + folderName); // Logs the creation for debugging

    moveUploadedFiles(e.response.getItemResponses(), sharedDriveFolder); // Moves uploaded files to the shared drive folder

    sendEmail(e.response, sharedDriveFolder, folderName); // Sends an email notification about the form submission
  } catch (error) {
    Logger.log("Error: " + error.toString()); // Logs any errors that occur during the execution
  }
}

// Builds the folder name based on form responses and timestamp, excluding file uploads and specific titles
function buildFolderName(itemResponses, timestamp) {
  let parts = itemResponses
    .filter(response => response.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD && !EXCLUDE_FROM_FOLDER_NAME.includes(response.getItem().getTitle()))
    .map(response => {
      let answer = response.getResponse();
      return Array.isArray(answer) ? answer.join(", ") : answer.toString(); // Formats the response for inclusion in the folder name
    });
  return timestamp + "_" + parts.join("_"); // Combines the timestamp and filtered responses to form a unique folder name
}

// Moves uploaded files directly to the shared drive folder using their IDs
function moveUploadedFiles(itemResponses, sharedDriveFolder) {
  itemResponses
    .filter(itemResponse => itemResponse.getItem().getType() === FormApp.ItemType.FILE_UPLOAD) // Filters for file upload responses
    .forEach(itemResponse => {
      const fileIds = itemResponse.getResponse(); // Gets the file IDs from the response
      fileIds.forEach(fileId => {
        const file = DriveApp.getFileById(fileId); // Retrieves the file from Drive
        try {
          file.moveTo(sharedDriveFolder); // Moves the file to the designated shared drive folder
          Logger.log("File moved to shared drive folder: " + file.getName()); // Logs the file move for debugging
        } catch (error) {
          Logger.log("Error moving file to shared drive folder: " + error.toString()); // Logs any errors during the file move
        }
      });
    });
}

// Builds and sends the email with details of the form submission, excluding file uploads and specific titles
function sendEmail(response, sharedDriveFolder, folderName) {
  let emailBody = `<strong>Google Drive Folder containing the order documents:</strong> <a href="${sharedDriveFolder.getUrl()}">${sharedDriveFolder.getUrl()}</a><br/><br/>`; // Starts building the email body with a link to the shared folder
  response.getItemResponses().forEach(itemResponse => {
    if (!EXCLUDE_FROM_EMAIL_BODY.includes(itemResponse.getItem().getTitle()) && itemResponse.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD) {
      const questionTitle = itemResponse.getItem().getTitle(); // Gets the question title
      const response = itemResponse.getResponse(); // Gets the response
      // Appends each question and response to the email body, excluding specified questions
      emailBody += `<strong>${questionTitle}:</strong> ${Array.isArray(response) ? response.join(", ") : response}<br/><br/>`;
    }
  });

  // Sends the email to the specified recipient(s) with the constructed email body
  MailApp.sendEmail({
    to: EMAIL_ADDRESS,
    subject: "WRC Order Submission: " + folderName, // Customizes the email subject with the folder name
    htmlBody: emailBody // Sets the email body
  });
}
