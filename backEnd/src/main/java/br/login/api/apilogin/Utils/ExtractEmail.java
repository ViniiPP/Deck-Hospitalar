package br.login.api.apilogin.Utils;

import br.login.api.apilogin.entitys.UsuarioEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component
public class ExtractEmail {


    public ExtractEmail() {

    }

    public static String extrairEmail () throws Exception{

        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            Optional<UsuarioEntity> optionalUserModel = (Optional<UsuarioEntity>) authentication.getPrincipal();

            return optionalUserModel.map(UsuarioEntity::getEmail).orElse("");
        }catch (Exception e){
            throw new Exception ("Usuario não existe ou não esta autenticado");
        }


    }
}
