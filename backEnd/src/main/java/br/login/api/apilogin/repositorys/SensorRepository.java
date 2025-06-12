package br.login.api.apilogin.repositorys;

import br.login.api.apilogin.entitys.SensorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorRepository extends JpaRepository<SensorEntity, String> {


}
