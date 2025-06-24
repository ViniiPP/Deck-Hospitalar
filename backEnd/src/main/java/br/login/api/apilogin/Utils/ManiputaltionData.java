package br.login.api.apilogin.Utils;

import br.login.api.apilogin.entitys.DadosEntity;
import br.login.api.apilogin.repositorys.ConvertData;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.Optional;

public class ManiputaltionData implements ConvertData {

    static String qualidade_do_ar;


    public static DadosEntity ConvertionData(String data) throws Exception {
        try {
            String json = data.replace("'", "\"");
            ObjectMapper mapper = new ObjectMapper();

            Map map = mapper.readValue(json, Map.class);

            String uuid = map.get("uuid").toString();
            String temperatura = map.get("temperatura").toString();
            String umidade = map.get("umidade").toString();
            String luminosidade = map.get("luminosidade").toString();
            String ruido = map.get("ruido").toString();
            String qualidade = map.get("qualidade_do_ar").toString();

            int qualidadeAr = Integer.parseInt(qualidade);


            if (qualidadeAr >= 900){
                qualidade_do_ar = "Excelente";
            }
            else if(  qualidadeAr >=  700 && qualidadeAr <= 900){
                qualidade_do_ar = "Bom";
            } else if ( qualidadeAr >=  500 && qualidadeAr <= 700){
                qualidade_do_ar = "Moderado";
            }
            else {
                qualidade_do_ar = "Ruim";
            }

            return new DadosEntity(qualidade_do_ar ,ruido,umidade,temperatura,luminosidade,uuid);
        } catch (Exception e){
            return null;
        }


    }


}
