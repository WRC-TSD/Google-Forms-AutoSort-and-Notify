const PARENT_FOLDER_ID = 'put the original google form file upload location here'; // Original temporary folder
const TARGET_SHARED_DRIVE_ID = 'put the folder you want here'; // Shared drive ID
const EMAIL_ADDRESS = 'email address here. for multiple separate with a comma'; // Your email address

// Titles of questions to exclude from the folder name
const EXCLUDE_FROM_FOLDER_NAME = ["Question 1 Title", "Question 5 Title", "Question 6 Title", "Question 7 Title"]; // Replace with your question titles

// Titles of questions to exclude from the email body
const EXCLUDE_FROM_EMAIL_BODY = ["Question 2 Title"]; // Replace with your question titles

const initialize = () => {
  const form = FormApp.getActiveForm();
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
};

const onFormSubmit = (e) => {
  try {
    const timestamp = Utilities.formatDate(new Date(), "America/New_York", "yyMMddHHmm");
    const folderName = buildFolderName(e.response.getItemResponses(), timestamp);
    const emailSubject = "WRC Order Submission: " + folderName;

    // Create temporary folder in the original drive
    const tempFolder = DriveApp.getFolderById(PARENT_FOLDER_ID).createFolder(folderName);

    // Process file uploads...
    e.response.getItemResponses()
      .filter(itemResponse => itemResponse.getItem().getType() === FormApp.ItemType.FILE_UPLOAD)
      .forEach(itemResponse => {
        const fileIds = itemResponse.getResponse();
        fileIds.forEach(fileId => {
          DriveApp.getFileById(fileId).moveTo(tempFolder);
        });
      });

    // Create a new folder in the target shared drive
    const sharedDriveFolder = DriveApp.getFolderById(TARGET_SHARED_DRIVE_ID).createFolder(folderName);

    // Copy files from the temporary folder to the new folder in the shared drive
    const files = tempFolder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      file.makeCopy(file.getName(), sharedDriveFolder);
    }

    // Building email body with all responses except file uploads and excluded questions, using HTML for formatting
    let emailBody = `<strong>Google Drive Folder containing the order documents:</strong> <a href="${sharedDriveFolder.getUrl()}">${sharedDriveFolder.getUrl()}</a><br/><br/>`;
    e.response.getItemResponses().forEach(itemResponse => {
      const questionTitle = itemResponse.getItem().getTitle();
      if (itemResponse.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD && !EXCLUDE_FROM_EMAIL_BODY.includes(questionTitle)) {
        const response = itemResponse.getResponse();
        emailBody += `<strong>${questionTitle}:</strong> ${Array.isArray(response) ? response.join(", ") : response}<br/><br/>`;
      }
    });

    // Send email notification with HTML format
    MailApp.sendEmail({
      to: EMAIL_ADDRESS,
      subject: emailSubject,
      htmlBody: emailBody // specify the HTML content
    });

    // Optionally delete the temporary folder
    tempFolder.setTrashed(true);
  } catch (error) {
    Logger.log("Error: " + error.toString());
  }
};

function buildFolderName(itemResponses, timestamp) {
  let parts = itemResponses
    .filter(response => {
      // Exclude file uploads and specific titles from folder name
      return response.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD &&
             !EXCLUDE_FROM_FOLDER_NAME.includes(response.getItem().getTitle());
    })
    .map(response => {
      let answer = response.getResponse();
      if (Array.isArray(answer)) {
        return answer.join(", ");
      }
      return answer.toString();
    });
  return timestamp + "_" + "Pending" + "_" + parts.join("_");
}
