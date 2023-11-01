let express = require("express");
let ldap = require("ldapjs");
let app = express();

app.listen(4000, () => {
  console.log("Server running");
});

let client = ldap.createClient({
  url: "ldap://127.0.0.1:10389",
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
    // filter: "objectClass=*",
    // filter: "cn=*",
    // filter: "(&(uid=7)(sn=progtech))",
    filter: "(|(uid=7)(sn=klaphachon))",
    scope: "sub",
    attributes: ["sn", "cn"],
  };

  client.search("ou=users,ou=system", opts, (err, res) => {
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
    sn: 'bar',
    // email: ['foo@bar.com', 'foo1@bar.com'],
    objectclass: 'inetOrgPerson'
  };
  client.add('cn=ptc,ou=users,ou=system', entry, (err) => {
    if (err) {
      console.log('error in new user ' + err);
    } else {
      console.log('added user');
    }
  });
};

const deleteUser = () => {
  client.del('cn=ptc,ou=users,ou=system', (err) => {
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
      type: 'uniqueMember',
      values: ['cn=surrus,ou=users,ou=system']
    }
  });
  
  client.modify('cn=Administrators,ou=groups,ou=system', change, (err) => {
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
      type: 'sn',
      values: ['cat']
    }
  });
  
  client.modify('cn=surrus,ou=users,ou=system', change, (err) => {
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
      type: 'roomNumber',
      values: ['B327']
    }
  });
  
  client.modify('cn=surrus,ou=users,ou=system', change, (err) => {
    if (err) {
      console.log('error in update attr  ' + err);
    } else {
      console.log('updated attr');
    }
  });
}

const compareAttribute = () => {

  client.compare('cn=surrus,ou=users,ou=system', 'sn', 'bar', (err, matched) => {
    if (err) {
      console.log('error in match' + err);
    } else {
      console.log('result: ' + matched);
    }
  });
}

const updateDN = () => {

  client.modifyDN('cn=bar,ou=users,ou=system', 'cn=surrus', (err) => {
    if (err) {
      console.log('error in update DN' + err);
    } else {
      console.log('updated DN');
    }
  });
}

authenticateDN("uid=admin,ou=system", "secret");
