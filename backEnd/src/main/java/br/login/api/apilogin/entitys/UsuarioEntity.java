package br.login.api.apilogin.entitys;

import br.login.api.apilogin.components.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "usuario")
public class UsuarioEntity extends GenericEntity implements UserDetails {

    @Column(length = 100, nullable = false)
    private String email;
    @Column(length = 100, nullable = false)
    @JsonIgnore
    private String senha;

    @OneToMany(mappedBy = "user")
    private List<SensorEntity> sensors;




    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }





    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
       return this.email;
    }
}
