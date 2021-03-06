package com.tcs.airline;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tcs.airline.model.Flight;
import com.tcs.airline.model.Passenger;


@SpringBootTest
@RunWith(SpringRunner.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class XAllScenariosTest {
	
	  private MockMvc mockMvc;
	  
	  @Autowired
	  WebApplicationContext context;

	  
		@Before
		public void setup() throws Exception {
			mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
		}
		
	@Test
	  public void a1() throws Exception{
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd-HH");
		Date dTime = df.parse("2018-01-12-01");
		Date aTime = df.parse("2018-01-12-03");
		Flight f = new Flight("A56555", "Chennai", "Bangalore", 2000, 200, "testdesc", aTime, dTime, "manufacturer",
				"model", 2009);
		byte[] fJson = toJson(f);
		mockMvc.perform(post("/api/flight/A56555").content(fJson).contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isCreated());

		Passenger pass = new Passenger("Ram1", "Ganesh", "Male", 20, "676767");
		byte[] passJson = toJson(pass);
		mockMvc.perform(post("/api/passenger").content(passJson).contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isCreated());
	    MvcResult mvcResult=mockMvc.perform(get("/api/passenger/name/Ram1" )
	            .contentType(MediaType.APPLICATION_JSON)
	            .accept(MediaType.APPLICATION_JSON)).andDo(print())
	                    .andExpect(status().isOk()).andReturn();
	    JSONObject jsonObj = new JSONObject(mvcResult.getResponse().getContentAsString());
		mockMvc.perform(post("/api/reservation/"+jsonObj.getString("id")+"/A56555").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isCreated());
		
		Flight f1 = new Flight("A56555", "Chennai", "Bangalore", 2000, 0, "testdesc", aTime, dTime, "manufacturer",
				"model", 2009);
		byte[] fJson1 = toJson(f1);
		mockMvc.perform(post("/api/flight/A56555").content(fJson1).contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isBadRequest());
		
		Flight f2 = new Flight("A56555", "Chennai", "Bangalore", 2000, 2, "testdesc", aTime, dTime, "manufacturer",
				"model", 2009);
		byte[] fJson2 = toJson(f2);
		mockMvc.perform(post("/api/flight/A56555").content(fJson2).contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isOk());
	    
		mockMvc.perform(delete("/api/passenger/"+jsonObj.getString("id") )
		        .contentType(MediaType.APPLICATION_JSON)
		        .accept(MediaType.APPLICATION_JSON)).andDo(print())
		                .andExpect(status().isOk());
	    
	  }
	
	  private byte[] toJson(Object r) throws Exception {
		    ObjectMapper map = new ObjectMapper();
		    return map.writeValueAsString(r).getBytes();
		}
}
