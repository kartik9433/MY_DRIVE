package com.kartik.DriveProject.controller;

import com.kartik.DriveProject.entity.FileEntity;
import com.kartik.DriveProject.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/apis/files")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class FileController {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileEntity> uploadFile(@RequestParam("file")MultipartFile file,
                                             @RequestParam(value = "parentFolderId",required = false)
                                             Long parentFolderId){
        try {
              FileEntity fileEntity =  fileService.saveFile(file,parentFolderId);
             return  ResponseEntity.ok(fileEntity);
        }
        catch (Exception e){
              return  ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource>download(@PathVariable Long id){
        try {
            FileEntity fileEntity = fileService.getFileById(id);
            Path path  = Paths.get(fileEntity.getPath());
            Resource resource = new UrlResource(path.toUri());
            return ResponseEntity.
                    ok()
                    .header("Content-Disposition","attachment;filename=\""+fileEntity.getName()+"\"")
                    .body(resource);
        }
        catch (Exception e){
            return  ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<FileEntity>> listFiles(
            @RequestParam(value = "parentFolderId",required = false)Long parentFolderID){
           List<FileEntity>files;
           if (parentFolderID == null){
               files = fileService.searchAll(null);
           }
           else{
               files = fileService.searchAll(parentFolderID);
           }
           return ResponseEntity.ok(files);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String>deleteFile(@PathVariable Long id){
         try{
             FileEntity fileEntity = fileService.getFileById(id);
             Path path  = Paths.get(fileEntity.getPath());
             Files.deleteIfExists(path);
             fileService.getFileById(id);
            return  ResponseEntity.ok("file deleted successfully");
         }
         catch (Exception e){
                return ResponseEntity.status(500).body("Failed to delete File");
         }
    }
}
