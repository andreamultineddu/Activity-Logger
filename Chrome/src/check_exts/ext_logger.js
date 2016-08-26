var text = '{"Nome" : "", "Installata" : "", "Abilitata" : "" , "Disabilitata" : "", "Disinstallata" : ""}';

chrome.management.getAll(function(extInfos) {
	var lista = "";
	for(var i = 0; i < extInfos.length; i++)
	{
		lista += extInfos[i].name + "\n";
	}
	
	chrome.storage.local.get('Lista_attivita', function(data)
	{
		alert(data.Lista_attivita);
		//splitto la stringa lista in array
		var array_ext = lista.split('\n');
		if(data.Lista_attivita != "")
		{
			data.Lista_attivita = data.Lista_attivita.replace('\"\",\n', '');
			var array_log = data.Lista_attivita.split(',\n');
			//controllo che ogni estensione attualmente installata abbia una sua sezione per i log
			for(var i = 0; i < array_ext.length - 1; i++)
			{
				var trovato = false;
				for(var j = 0; j < array_log.length && !trovato; j++)
				{
					if(JSON.parse(array_log[j]).Nome == array_ext[i])
						trovato = true;
				}
			
				if(!trovato)
				{
					data.Lista_attivita += ',\n' + '{"Nome" : "' + array_ext[i] + '", "Installata" : "", "Abilitata" : "" , "Disabilitata" : "", "Disinstallata" : ""}';
				}
			}
			
			alert(data.Lista_attivita);
			chrome.storage.local.set({'Lista_attivita' : data.Lista_attivita});
			chrome.storage.local.get('Lista_attivita', function(data1) {alert(JSON.parse(data1.Lista_attivita.split(',\n')[1]).Nome);});
		}
		else
		{
			var string_log = "";
			for(var i = 0; i < array_ext.length - 1; i++)
			{
				string_log += '{"Nome" : "' + array_ext[i] + '", "Installata" : "", "Abilitata" : "" , "Disabilitata" : "", "Disinstallata" : ""}';
				if(i < array_ext.length - 2) string_log += ",\n";
			}
			
			chrome.storage.local.set({'Lista_attivita' : string_log});
			chrome.storage.local.get('Lista_attivita', function(data1){alert(JSON.parse(data1.Lista_attivita.split(',\n')[1]).Nome);});
		}
	});
});




chrome.management.onInstalled.addListener(function(extInfo)
{
	alert(extInfo.name);
});

chrome.management.onUninstalled.addListener(function(extInfo)
{
	alert(extInfo.name);
});

chrome.management.onEnabled.addListener(function(extInfo)
{
	chrome.storage.local.get('Lista_attivita', function(data)
	{
		var array_log = data.Lista_attivita.split(',\n');
		for(var i = 0; i < array_log.length; i++)
		{
			if(JSON.parse(array_log[i]).Nome == extInfo.name)
			{
				//modifico quando json e poi lo risalvo come stringa fatto questo ricopia per altri eventi e modifico il campo necessario
				array_log[i] = JSON.stringify(JSON.parse(array_log[i]).Abilitata + new Date().toLocaleString() + ",\n");
				break;
			}
		}
		var data_to_save = array_log.toString();
		chrome.storage.local.set({'Lista_attivita' : data_to_save});
	});
	alert(extInfo.name);
});

chrome.management.onDisabled.addListener(function(extInfo)
{
	alert(extInfo.name);
});