// Entry point function to start organizing subfolders based on predefined criteria
function organizeSubfolders() {
  const folderId = "drive folder id"; // The ID of the parent folder to organize
  const parentFolder = DriveApp.getFolderById(folderId); // Retrieves the parent folder by ID
  scanAndOrganizeSubfolders(parentFolder, parentFolder); // Initiates the recursive scan and organization process
}

// Recursively scans and organizes subfolders within a given folder according to sorting words
function scanAndOrganizeSubfolders(folder, baseParentFolder) {
  const sortingWords = ["EXAMPLE", "NOTHING", "COMPLETE", "CANCEL"]; // Define sorting criteria

  const subfolders = folder.getFolders(); // Retrieve all subfolders in the current folder
  while (subfolders.hasNext()) {
    const subfolder = subfolders.next();
    const nameComponents = subfolder.getName().split("_"); // Split folder name to extract sorting criteria
    if (nameComponents.length >= 2 && sortingWords.includes(nameComponents[1])) {
      const word = nameComponents[1]; // The sorting word from folder name
      const dateString = nameComponents[0]; // The date string from folder name
      if (dateString.length === 13) { // Ensure date string is of expected length
        const month = dateString.substring(4, 6); // Extract month from date string
        // Check if subfolder is already sorted correctly to avoid unnecessary moves
        if (!isSubfolderAlreadySorted(subfolder, baseParentFolder, word, month)) {
          const subfolderPath = `${word}/${month}`; // Construct expected folder path
          const newParentFolder = createSubfolders(baseParentFolder, subfolderPath); // Ensure path exists
          moveSubfolder(subfolder, newParentFolder); // Move subfolder to its sorted location
        }
      }
    }
    scanAndOrganizeSubfolders(subfolder, baseParentFolder); // Recursively scan this subfolder
  }
}

// Checks if a subfolder is already in its correct sorted location using folder IDs
function isSubfolderAlreadySorted(subfolder, baseParentFolder, expectedParentFolderName, month) {
  const expectedParentFolders = baseParentFolder.getFoldersByName(expectedParentFolderName); // Find expected parent folders
  while (expectedParentFolders.hasNext()) {
    const expectedParent = expectedParentFolders.next();
    const monthFolders = expectedParent.getFoldersByName(month); // Find month folders under expected parent
    while (monthFolders.hasNext()) {
      const monthFolder = monthFolders.next();
      // Check if subfolder's parent ID matches the expected month folder's ID
      if (subfolder.getParents().hasNext() && subfolder.getParents().next().getId() === monthFolder.getId()) {
        return true; // Subfolder is correctly sorted
      }
    }
  }
  return false; // Subfolder is not correctly sorted
}

// Moves a subfolder to a new parent folder, including all its contents
function moveSubfolder(subfolder, newParentFolder) {
  const targetSubfolder = newParentFolder.createFolder(subfolder.getName()); // Create a new subfolder in the new parent

  const files = subfolder.getFiles(); // Move all files in the original subfolder to the new one
  while (files.hasNext()) {
    const file = files.next();
    file.moveTo(targetSubfolder); // Move each file
  }

  const subSubfolders = subfolder.getFolders(); // Recursively move all sub-subfolders
  while (subSubfolders.hasNext()) {
    const subSubfolder = subSubfolders.next();
    moveSubfolder(subSubfolder, targetSubfolder); // Move each sub-subfolder
  }

  subfolder.setTrashed(true); // Trash the original subfolder after moving its contents
}

// Creates the necessary subfolder structure within a given folder based on a specified path
function createSubfolders(folder, subfolderPath) {
  let currentFolder = folder;
  const subfolders = subfolderPath.split("/"); // Split path into components
  for (const subfolderName of subfolders) {
    let subfolder = findOrCreateFolder(currentFolder, subfolderName); // Find or create each path component
    currentFolder = subfolder; // Navigate down the folder hierarchy
  }
  return currentFolder; // Return the final folder in the path
}

// Finds or creates a folder by name under a specified parent folder
function findOrCreateFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName); // Search for the folder by name
  if (folders.hasNext()) {
    return folders.next(); // Return the folder if it exists
  } else {
    return parentFolder.createFolder(folderName); // Otherwise, create a new folder
  }
}

// Sets up an automatic trigger to run the organizeSubfolders function periodically
function createTrigger() {
  ScriptApp.newTrigger("organizeSubfolders")
    .timeBased()
    .everyMinutes(15) // Set the frequency of execution
    .create(); // Create the trigger
}
