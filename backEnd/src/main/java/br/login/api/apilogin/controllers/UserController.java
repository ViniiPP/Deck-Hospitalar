package br.login.api.apilogin.controllers;



import br.login.api.apilogin.Utils.ExtractEmail;
import br.login.api.apilogin.entitys.UsuarioEntity;
import br.login.api.apilogin.repositorys.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("User")
public class UserController {

    @Autowired
    ExtractEmail extractEmail;

    public UserController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    UsuarioRepository usuarioRepository;

    @GetMapping()
    @CrossOrigin(origins = "*")
    public ResponseEntity<UsuarioEntity> getUser() throws Exception {
        String email = ExtractEmail.extrairEmail();
        Optional<UsuarioEntity> findUser = this.usuarioRepository.findByEmail(email);
        try {
            return ResponseEntity.ok().body(findUser.get());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

}
