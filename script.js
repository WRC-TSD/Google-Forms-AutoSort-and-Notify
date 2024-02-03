const PARENT_FOLDER_ID = 'put the original google form file upload location here'; // Original temporary folder
const TARGET_SHARED_DRIVE_ID = 'put the folder you want here'; // Shared drive ID
const EMAIL_ADDRESS = 'email address her. for multiple separate with a comma'; // Your email address 

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
    const emailSubject = "WRC order submission: " + folderName;

    // Create temporary folder in the original drive
    const tempFolder = DriveApp.getFolderById(PARENT_FOLDER_ID).createFolder(folderName);

    // Process file uploads
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

    // Send email notification with the folder URL in the target shared drive
    MailApp.sendEmail(EMAIL_ADDRESS, emailSubject, "Google Drive Folder containing the order documents: " + sharedDriveFolder.getUrl());

    // Optionally delete the temporary folder
    tempFolder.setTrashed(true);
  } catch (error) {
    Logger.log("Error: " + error.toString());
  }
};

function buildFolderName(itemResponses, timestamp) {
  // Filter out file upload responses before building the folder name
  let parts = itemResponses
    .filter(response => response.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD)
    .map(response => {
      // Safely handle different types of responses
      let answer = response.getResponse();
      if (Array.isArray(answer)) {
        // For multiple choice questions where multiple answers can be selected
        return answer.join(", ");
      }
      return answer.toString();
    });
  return timestamp + "_" + "Pending" + "_" + parts.join("_");
}
