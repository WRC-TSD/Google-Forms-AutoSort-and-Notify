function organizeSubfolders() {
  const folderId = "drive folder id";
  const parentFolder = DriveApp.getFolderById(folderId);
  scanAndOrganizeSubfolders(parentFolder, parentFolder); // Pass parentFolder twice, first as current scanning folder, second as the base for organizing
}

function scanAndOrganizeSubfolders(folder, baseParentFolder) {
  const sortingWords = ["SENT", "HOLD", "COMPLETE"];

  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    const subfolder = subfolders.next();
    const nameComponents = subfolder.getName().split("_");
    if (nameComponents.length >= 2 && sortingWords.includes(nameComponents[1])) {
      const word = nameComponents[1];
      const dateString = nameComponents[0];
      if (dateString.length === 10) {
        const month = dateString.substring(2, 4);
        const subfolderPath = `${word}/${month}`;
        const newParentFolder = createSubfolders(baseParentFolder, subfolderPath); // Always use baseParentFolder for organizing
        moveSubfolder(subfolder, newParentFolder);
      }
    }
    // Continue scanning recursively with the baseParentFolder unchanged
    scanAndOrganizeSubfolders(subfolder, baseParentFolder);
  }
}

function moveSubfolder(subfolder, newParentFolder) {
  // This function remains unchanged
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
  subfolder.setTrashed(true);
}

function createSubfolders(folder, subfolderPath) {
  // This function remains unchanged
  let currentFolder = folder;
  const subfolders = subfolderPath.split("/");
  for (const subfolderName of subfolders) {
    let subfolder = findOrCreateFolder(currentFolder, subfolderName);
    currentFolder = subfolder;
  }
  return currentFolder;
}

function findOrCreateFolder(parentFolder, folderName) {
  // This function remains unchanged
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parentFolder.createFolder(folderName);
  }
}

function createTrigger() {
  // This function remains unchanged
  ScriptApp.newTrigger("organizeSubfolders")
    .timeBased()
    .everyMinutes(5)
    .create();
}
