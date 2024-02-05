function organizeSubfolders() {
  const folderId = "parent folder id";
  const sortingWords = ["SENT", "HOLD", "COMPLETE"];

  const parentFolder = DriveApp.getFolderById(folderId);
  const subfolders = parentFolder.getFolders();
  while (subfolders.hasNext()) {
    const subfolder = subfolders.next();
    const nameComponents = subfolder.getName().split("_");
    if (nameComponents.length >= 2 && sortingWords.includes(nameComponents[1])) {
      const word = nameComponents[1];
      // Assuming the date is embedded at the start of the folder name in yyMMddHHmm format
      const dateString = nameComponents[0]; // Full date string
      if (dateString.length === 10) { // Validating the date string length
        const month = dateString.substring(2, 4); // Extracting the MM part
        const subfolderPath = `${word}/${month}`; // Using MM for subfolder naming
        const newParentFolder = createSubfolders(parentFolder, subfolderPath);
        moveSubfolder(subfolder, newParentFolder);
      }
    }
  }
}

function moveSubfolder(subfolder, newParentFolder) {
  const newSubfolder = newParentFolder.createFolder(subfolder.getName());
  const files = subfolder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    file.makeCopy(file.getName(), newSubfolder);
  }
  const subSubfolders = subfolder.getFolders();
  while (subSubfolders.hasNext()) {
    const subSubfolder = subSubfolders.next();
    moveSubfolder(subSubfolder, newSubfolder);
  }

  // After moving all contents, move the original subfolder to the Trash
  subfolder.setTrashed(true);
}

function createSubfolders(folder, subfolderPath) {
  let currentFolder = folder;
  const subfolders = subfolderPath.split("/");
  for (const subfolderName of subfolders) {
    let subfolder = findOrCreateFolder(currentFolder, subfolderName);
    currentFolder = subfolder;
  }
  return currentFolder;
}

function findOrCreateFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next(); // Returns the first found folder if it exists
  } else {
    return parentFolder.createFolder(folderName); // Creates a new folder if none was found
  }
}

function createTrigger() {
  ScriptApp.newTrigger("organizeSubfolders")
    .timeBased()
    .everyMinutes(5)
    .create();
}
