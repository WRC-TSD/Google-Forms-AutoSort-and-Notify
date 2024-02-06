// Constants for configuration
const PARENT_FOLDER_ID = 'put the original google form file upload location here'; // ID of the original folder for temporary storage
const TARGET_SHARED_DRIVE_ID = 'put the folder you want here'; // Target shared drive ID where the final folder will be created
const EMAIL_ADDRESS = 'email address here. for multiple separate with a comma'; // Recipient(s) email address(es)

// Exclusions for naming and email content
const EXCLUDE_FROM_FOLDER_NAME = ["Question 1 Title", "Question 5 Title", "Question 6 Title", "Question 7 Title"]; // Titles of questions to exclude from folder name
const EXCLUDE_FROM_EMAIL_BODY = ["Question 2 Title"]; // Titles of questions to exclude from email body

// Initializes the script by creating a trigger for form submission
const initialize = () => {
  const form = FormApp.getActiveForm(); // Gets the current Google Form
  ScriptApp.newTrigger('onFormSubmit') // Creates a new trigger
    .forForm(form) // For the current form
    .onFormSubmit() // That activates on form submission
    .create(); // Creates the trigger
};

// Handles form submission
const onFormSubmit = (e) => {
  try {
    // Processes the form submission
    const timestamp = Utilities.formatDate(new Date(), "America/New_York", "yyyyMMdd-HHmm"); // Formats current timestamp
    const folderName = buildFolderName(e.response.getItemResponses(), timestamp); // Builds the folder name
    const emailSubject = "WRC Order Submission: " + folderName; // Sets the email subject

    // Creates a temporary folder in the parent directory
    const tempFolder = DriveApp.getFolderById(PARENT_FOLDER_ID).createFolder(folderName);

    // Processes and moves uploaded files to the temporary folder
    e.response.getItemResponses()
      .filter(itemResponse => itemResponse.getItem().getType() === FormApp.ItemType.FILE_UPLOAD) // Filters for file upload responses
      .forEach(itemResponse => {
        const fileIds = itemResponse.getResponse(); // Gets file IDs
        fileIds.forEach(fileId => {
          DriveApp.getFileById(fileId).moveTo(tempFolder); // Moves files to the temporary folder
        });
      });

    // Creates a new folder in the target shared drive and copies files there
    const sharedDriveFolder = DriveApp.getFolderById(TARGET_SHARED_DRIVE_ID).createFolder(folderName);
    const files = tempFolder.getFiles(); // Gets all files in the temporary folder
    while (files.hasNext()) {
      const file = files.next();
      file.makeCopy(file.getName(), sharedDriveFolder); // Copies each file to the shared drive folder
    }

    // Builds the email body excluding specified responses and file uploads
    let emailBody = `<strong>Google Drive Folder containing the order documents:</strong> <a href="${sharedDriveFolder.getUrl()}">${sharedDriveFolder.getUrl()}</a><br/><br/>`;
    e.response.getItemResponses().forEach(itemResponse => {
      const questionTitle = itemResponse.getItem().getTitle();
      if (itemResponse.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD && !EXCLUDE_FROM_EMAIL_BODY.includes(questionTitle)) {
        const response = itemResponse.getResponse(); // Gets the response
        emailBody += `<strong>${questionTitle}:</strong> ${Array.isArray(response) ? response.join(", ") : response}<br/><br/>`; // Adds to email body
      }
    });

    // Sends the email with the constructed body
    MailApp.sendEmail({
      to: EMAIL_ADDRESS,
      subject: emailSubject,
      htmlBody: emailBody // Specifies the HTML content for the email
    });

    // Optionally deletes the temporary folder
    tempFolder.setTrashed(true); // Moves the temporary folder to trash
  } catch (error) {
    Logger.log("Error: " + error.toString()); // Logs any errors
  }
};

// Builds the folder name based on form responses and timestamp
function buildFolderName(itemResponses, timestamp) {
  let parts = itemResponses
    .filter(response => {
      // Excludes file uploads and specified titles from folder name
      return response.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD &&
             !EXCLUDE_FROM_FOLDER_NAME.includes(response.getItem().getTitle());
    })
    .map(response => {
      // Processes each response for folder naming
      let answer = response.getResponse();
      if (Array.isArray(answer)) {
        return answer.join(", ");
      }
      return answer.toString();
    });
  return timestamp + "_" + "PENDING" + "_" + parts.join("_"); // Constructs folder name
}
