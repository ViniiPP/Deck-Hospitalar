package br.login.api.apilogin.controllers;

import br.login.api.apilogin.DTOS.SigninDTO;
import br.login.api.apilogin.DTOS.SignupDTO;
import br.login.api.apilogin.Utils.Adressutils;
import br.login.api.apilogin.components.JWTutils;

import br.login.api.apilogin.entitys.UsuarioEntity;
import br.login.api.apilogin.services.UsuarioService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationConfiguration auth;
    @Autowired

    public AuthController(UsuarioService usuarioService, AuthenticationConfiguration auth) {
        this.usuarioService = usuarioService;
        this.auth = auth;

    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioEntity> signup(@RequestBody SignupDTO signup) throws Exception {
        UsuarioEntity novoUsuario = new UsuarioEntity();
        BeanUtils.copyProperties(signup, novoUsuario);

        System.out.println("Dados recebidos para signup: " + signup);
        System.out.println("Dados do novo usuário: " + novoUsuario);

        this.usuarioService.save(novoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    @PostMapping("/login")
    public ResponseEntity<String> signin(@RequestBody SigninDTO signin) throws Exception {
        auth.getAuthenticationManager().authenticate(new UsernamePasswordAuthenticationToken(signin.getEmail(),signin.getSenha()));
        String jwtToken = JWTutils.generateTokenFromUsername(signin.getEmail());
        return ResponseEntity.ok(jwtToken);
    }



    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exception(Exception e) {
        String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", "");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cleanMessage);
    }
}
