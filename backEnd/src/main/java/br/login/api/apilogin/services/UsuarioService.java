package br.login.api.apilogin.services;

import br.login.api.apilogin.components.Validador;
import br.login.api.apilogin.entitys.UsuarioEntity;
import br.login.api.apilogin.repositorys.GenericRepository;
import br.login.api.apilogin.repositorys.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService extends GenericService<UsuarioEntity> implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UsuarioEntity usuario = this.usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(email));
        return usuario;
    }

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        super();
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected GenericRepository<UsuarioEntity> getRepository() {
        return this.usuarioRepository;
    }

    @Override
    protected void validate(UsuarioEntity entidade) throws Exception {
        if (this.usuarioRepository.existsByEmail(entidade.getEmail())) {
            throw new Exception("Email já cadastrado");
        }

        String HashSenha =new BCryptPasswordEncoder().encode(entidade.getSenha());
        entidade.setSenha(HashSenha);
    }
}
