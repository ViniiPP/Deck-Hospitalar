package br.login.api.apilogin.repositorys;

import br.login.api.apilogin.entitys.UsuarioEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends GenericRepository <UsuarioEntity>{

    Boolean existsByEmail(String email);

    Optional<UsuarioEntity> findByEmail(String email);
}
