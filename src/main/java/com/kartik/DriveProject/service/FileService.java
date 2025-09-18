package com.kartik.DriveProject.service;

import com.kartik.DriveProject.entity.FileEntity;
import com.kartik.DriveProject.repo.FileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;


    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public FileEntity saveFile(MultipartFile file,Long parentFolderId) throws IOException {
             Path uploadpath = Paths.get(uploadDir);
             if(!Files.exists(uploadpath)){
                 Files.createDirectories(uploadpath);
             }
             String fileName = file.getOriginalFilename();
             Path filPath = uploadpath.resolve(fileName);

             Files.copy(file.getInputStream(),filPath, StandardCopyOption.REPLACE_EXISTING);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setName(fileName);
        fileEntity.setPath(filPath.toString());
        fileEntity.setSize(file.getSize());
        fileEntity.setType("file");
        fileEntity.setParentFolderID(parentFolderId);
        fileEntity.setCreatedAt(LocalDateTime.now());

        return  fileRepository.save(fileEntity);
    }


    public List<FileEntity> searchAll(Long parentFolderId){
           if (parentFolderId == null){
              return fileRepository.findAll().
                       stream().
                       filter(f->f.getParentFolderID()==null).
                       collect(Collectors.toList());
           }
           else{
              return fileRepository.findAll()
                       .stream()
                      .filter(f->parentFolderId.equals(f.getParentFolderID()))
                      .collect(Collectors.toList());
           }
    }
    public FileEntity getFileById(Long id){
       return fileRepository.findById(id).orElseThrow(()->new RuntimeException("file is not found"));
    }

    public void DeleteById(Long id){
        fileRepository.deleteById(id);
    }
}
