let express = require("express");
let ldap = require("ldapjs");
let app = express();

app.listen(4000, () => {
  console.log("Server running");
});

let client = ldap.createClient({
  // url: "ldap://WIN-1ILMGV10PMD.ptcldap.local:389"
  url: "ldap://192.168.1.77:389"
});

const authenticateDN = (username, password) => {

  client.bind(username, password, (err) => {
    if (err) {
      console.log("Error in new connection " + err);
    } else {
      console.log("Success");
      // searchUser();
      // addUser();
      // deleteUser();
      // addAttribute();
      // deleteAttribute();
      // updateAttribute();
      // compareAttribute();
      updateDN();
    }
  });
};

const searchUser = () => {
  const opts = {
    filter: "cn=*",
    scope: "sub",
    attributes: ["sn", "cn"]
  };

  client.search("ou=N4,dc=ptcldap,dc=local", opts, (err, res) => {
    if (err) {
      console.log("Error in new connection " + err);
    } else {
      res.on("searchRequest", (searchRequest) => {
        console.log("searchRequest: ", searchRequest.messageId);
      });
      res.on("searchEntry", (entry) => {
        console.log("entry: " + JSON.stringify(entry.pojo));
      });
      res.on("searchReference", (referral) => {
        console.log("referral: " + referral.uris.join());
      });
      res.on("error", (err) => {
        console.error("error: " + err.message);
      });
      res.on("end", (result) => {
        console.log("status: " + result.status);
      });
    }
  });
};

const addUser = () => {
  const entry = {
    // cn: 'addviacode',
    objectclass: 'person'
  };
  client.add('cn=addviacode,ou=Users,ou=N4,dc=ptcldap,dc=local', entry, (err) => {
    if (err) {
      console.log('error in new user ' + err);
    } else {
      console.log('added user');
    }
  });
};

const deleteUser = () => {
  client.del('cn=addviacode,ou=N4,dc=ptcldap,dc=local', (err) => {
    if (err) {
      console.log('error in delete user ' + err);
    } else {
      console.log('deleted user');
    }
  });
};

const addAttribute = () => {
  const change = new ldap.Change({
    operation: 'add',
    modification: {
      // type: 'roomNumber',
      // values: ['A327']
      type: 'displayName',
      values: ['RUS']
    }
  });
  
  client.modify('cn=addviacode,ou=Users,ou=N4,dc=ptcldap,dc=local', change, (err) => {
    if (err) {
      console.log('error in add user in a group ' + err);
    } else {
      console.log('added user in a group');
    }
  });
};

const deleteAttribute = () => {
  const change = new ldap.Change({
    operation: 'delete',
    modification: {
      // type: 'roomNumber',
      // values: ['A327']
      type: 'displayName',
      values: ['RUS']
    }
  });
  
  client.modify('cn=addviacode,ou=Users,ou=N4,dc=ptcldap,dc=local', change, (err) => {
    if (err) {
      console.log('error in delete attr  ' + err);
    } else {
      console.log('deleted attr');
    }
  });
}

const updateAttribute = () => {
  const change = new ldap.Change({
    operation: 'replace',
    modification: {
      type: 'displayName',
      values: ['addviacode']
    }
  });
  
  client.modify('cn=addviacode,ou=Users,ou=N4,dc=ptcldap,dc=local', change, (err) => {
    if (err) {
      console.log('error in update attr  ' + err);
    } else {
      console.log('updated attr');
    }
  });
}

const compareAttribute = () => {

  client.compare('cn=addviacode,ou=Users,ou=N4,dc=ptcldap,dc=local', 'displayName', 'addviacode', (err, matched) => {
    if (err) {
      console.log('error in match' + err);
    } else {
      console.log('result: ' + matched);
    }
  });
}

const updateDN = () => {

  client.modifyDN('cn=wowowow,ou=Users,ou=N4,dc=ptcldap,dc=local', 'cn=addviacode', (err) => {
    if (err) {
      console.log('error in update DN' + err);
    } else {
      console.log('updated DN');
    }
  });
}

authenticateDN("CN=ptc-rus-admin,CN=Users,DC=ptcldap,DC=local", "Progtech#1!");
