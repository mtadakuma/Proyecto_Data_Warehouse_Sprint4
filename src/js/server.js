//importar librerías
const compression = require("compression");
const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const expressJwt = require("express-jwt");
const cors = require("cors");
const { Op } = require('sequelize');

//puerto del servidor
const PORT = process.env.SERVER_PORT;
//importar modelos

const {
  Users,
  Regions,
  Countries,
  Cities,
  Companies,
  Contacts,
  Channels,
  ContactsHasChannels,
} = require("./models/index");

//JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
//crear instancia del server en express
const server = express();
//política de límite de peticiones
const limiter = rateLimit({
  windowMS: 10 * 1000,
  max: 50,
  message: "Excediste el número de peticiones. Intenta más tarde.",
});
//logger
const logger = (req, res, next) => {
  const path = req.path;
  const method = req.method;
  const body = req.body;

  process.nextTick(() => {
    console.log(`
        Método: ${method}
        Ruta: ${path}
        Body: ${JSON.stringify(body)}
        Params: ${JSON.stringify(req.params)}
        `);
  });
  next();
};

const verifyAdminMiddleware = async (req, res, next) => {
  let posibleUser = await Users.findOne({
    where: {
      email: req.user.email,
    },
  });

  if (!posibleUser.isAdmin) {
    res.status(403);
    res.json({ error: `Sin permisos de administrador` });
  } else {
    next();
  }
};

/*----------Users Middleware---------*/
const verifyUserExistsMiddleware = async (req, res, next) => {
  let posibleUser = await Users.findOne({
    where: {
      [Op.or]: [
        { email: req.body.email },
        { username: req.body.username }
      ],
    },
  });

  if (posibleUser != null) {
    res.status(406);
    res.json({ error: `El usuario ya existe en la base` });
  } else {
    next();
  }
};

const verifyUserBodyMiddleware = (req, res, next) =>{ 
  const {first_name, last_name, email, isAdmin, password, username } = req.body;
  if(!first_name || !last_name || !email || !isAdmin || !password || !username){
      res.status(400);
      res.json({ error: `Algun campo está vacío` });
  }
  next();
};
/*----------End of Users Middleware---------*/
/*----------Regions Middleware---------*/
const verifyRegionExistsMiddleware = async (req, res, next) => {
  let posibleRegion = await Regions.findOne({
    where: {
      name: req.body.name,
    },
  });

  if (posibleRegion != null) {
    res.status(406);
    res.json({ error: `La región ya existe en la base` });
  } else {
    next();
  }
};

const verifyRegionBodyMiddleware = (req, res, next) =>{ 
  const {name} = req.body;
  if(!name){
      res.status(400);
      res.json({ error: `El campo nombre está vacío` });
  }
  next();
};
/*----------End of Regions Middleware---------*/
/*----------Countries Middleware---------*/

const verifyCountryExistsMiddleware = async (req, res, next) => {
  let posibleCountry = await Countries.findOne({
    where: {
      name: req.body.name,
    },
  });

  if (posibleCountry != null) {
    res.status(406);
    res.json({ error: `El país ya existe en la base` });
  } else {
    next();
  }
};

const verifyCountryBodyMiddleware = (req, res, next) =>{ 
  const {name} = req.body;
  if(!name){
      res.status(400);
      res.json({ error: `El campo nombre está vacío` });
  }
  next();
};
/*----------End of Countries Middleware---------*/
/*----------Cities Middleware---------*/
const verifyCityExistsMiddleware = async (req, res, next) => {
  let posibleCity = await Cities.findOne({
    where: {
      name: req.body.name,
    },
  });

  if (posibleCity != null) {
    res.status(406);
    res.json({ error: `La ciudad ya existe en la base` });
  } else {
    next();
  }
};

const verifyCityBodyMiddleware = (req, res, next) =>{ 
  const {name} = req.body;
  if(!name){
      res.status(400);
      res.json({ error: `El campo nombre está vacío` });
  }
  next();
};
/*----------End of Cities Middleware---------*/
/*----------Companies Middleware---------*/
const verifyCompanyExistsMiddleware = async (req, res, next) => {
  let posibleCompany = await Companies.findOne({
    where: {
      [Op.or]: [
        { email: req.body.email },
        { name: req.body.name }
      ],
    },
  });

  if (posibleCompany != null) {
    res.status(406);
    res.json({ error: `La compañía ya existe en la base` });
  } else {
    next();
  }
};

const verifyCompanyBodyMiddleware = (req, res, next) =>{ 
  const {name, address, email, telephone, cities_id} = req.body;
  if(!name || !address || !email || !telephone || !cities_id){
      res.status(400);
      res.json({ error: `Algún campo está vacío` });
  }
  next();
};
/*----------End of Companies Middleware---------*/
/*----------Contacts Middleware---------*/
const verifyContactExistsMiddleware = async (req, res, next) => {
  let posibleContact = await Contacts.findOne({
    where: {
      email: req.body.email
    },
  });

  if (posibleContact != null) {
    res.status(406);
    res.json({ error: `El contacto ya existe en la base` });
  } else {
    next();
  }
};

const verifyContactBodyMiddleware = (req, res, next) =>{ 
  const {firstName, lastName, position, email, address, cities_id, companies_id, interest} = req.body;
  if(!firstName || !lastName || !position || !email || !address || !cities_id || !companies_id || !interest){
      res.status(400);
      res.json({ error: `Algún campo está vacío` });
  }
  next();
};


//middlewares globales
server.use(express.json());
server.use(compression());
server.use(helmet());
server.use(limiter);
server.use(logger);
server.use(cors());

server.use(
  expressJwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: ["/login"],
  })
);

server.post("/login", async (req, res) => {
  const { user, password } = req.body;

  try {
    const posibleUsuario = await Users.findOne({
      where: {
        [Op.or]: [
          { email: user },
          { username: user }
        ],
        password,
      },
    });

    if (posibleUsuario) {
      let isAdmin = posibleUsuario.isAdmin;
      const token = jwt.sign(
        {
          //firmo solo con id, nombre y correo
          id: posibleUsuario.id,
          email: posibleUsuario.email,
          username: posibleUsuario.username,
          isAdmin: posibleUsuario.isAdmin,
        },
        JWT_SECRET,
        /*{ expiresIn: "120m" } */
      );
      res.status(200).json({ token, isAdmin });
    } else {
      res.status(401).json({
        error: "Correo y/o contraseña invalido",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error, intente nuevamente mas tarde...",
    });
  }
});

/*-----------------      Users     -----------------*/
server.get("/users",verifyAdminMiddleware, async (req, res) => {
  const users = await Users.findAll(
    {
      where: {
        isActive: true
      }
    }
  );
  res.status(200).json(users);
});


server.post("/users", verifyAdminMiddleware, verifyUserExistsMiddleware, verifyUserBodyMiddleware, async (req, res) => {
  const { first_name, last_name, email, isAdmin, password, username } = req.body;
  const nuevoUsuario = await Users.create({
    first_name,
    last_name,
    email,
    isAdmin,
    password,
    username
  });

  res.status(201).json(nuevoUsuario);
});


server.put("/users/:id", verifyAdminMiddleware, verifyUserBodyMiddleware, async (req, res) => {
  const { first_name, last_name, email, isAdmin, password, username }= req.body;
  const idParam = req.params.id;
  const nuevoUsuario = await Users.update(
    {
      first_name,
      last_name,
      email,
      isAdmin,
      password,
      username
    },
    {
      where: {
        id: idParam,
      },
    }
  );
  res.status(201).json(nuevoUsuario);
});


server.delete("/users/:id", verifyAdminMiddleware, async (req, res) => {
  const idParam = req.params.id;
  const nuevoUsuario = await Users.update(
    {
      isActive: false,
    },
    {
      where: {
        id: idParam,
      },
    }
  );
  res.status(201).json(nuevoUsuario);
});

/*-----------------  End of Users  -----------------*/

/*-----------------Region / Ciudad -----------------*/
server.get("/allRegionsCities", async (req, res) => {
  const allRegionsCities = await Regions.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: Countries,
        required: false,
        attributes: ["id", "name", "isActive"],
        where: { isActive: true },
        include: {
          model: Cities,
          required: false,
          attributes: ["id", "name", "isActive"],
          where: { isActive: true },
        },
      },
    ],
  });
  res.status(200).json(allRegionsCities);
});

server.post("/regions", verifyRegionExistsMiddleware,verifyRegionBodyMiddleware, async (req, res) => {
  const name = req.body.name;
  const nuevaRegion = await Regions.create({
    name,
  });

  res.status(201).json(nuevaRegion);
});

server.post("/countries", verifyCountryExistsMiddleware, verifyCountryBodyMiddleware, async (req, res) => {
  const { name, region_id } = req.body;
  const nuevoPais = await Countries.create({
    name,
    region_id,
  });

  res.status(201).json(nuevoPais);
});

server.put("/countries/:id", verifyCountryBodyMiddleware, async (req, res) => {
  const { name, region_id } = req.body;
  const idParam = req.params.id;
  const nuevoPais = await Countries.update(
    {
      name,
      region_id,
    },
    {
      where: {
        id: idParam,
      },
    }
  );
  res.status(201).json(nuevoPais);
});

server.delete("/countries/:id", async (req, res) => {
  const idParam = req.params.id;
  const paisEliminar = await Countries.update(
    { isActive: false },
    {
      where: {
        id: idParam,
      },
    }
  );
  res.status(201).json(paisEliminar);
});

server.post("/cities", verifyCityExistsMiddleware, verifyCityBodyMiddleware, async (req, res) => {
  const { name, countries_id } = req.body;
  const nuevaCiudad = await Cities.create({
    name,
    countries_id,
  });

  res.status(201).json(nuevaCiudad);
});

server.put("/cities/:id", verifyCityBodyMiddleware, async (req, res) => {
  const { name, cities_id } = req.body;
  const idParam = req.params.id;
  const nuevaCiudad = await Cities.update(
    {
      name,
    },
    {
      where: {
        id: idParam,
      },
    }
  );
  res.status(201).json(nuevaCiudad);
});

server.delete("/cities/:id", async (req, res) => {
  const idParam = req.params.id;
  const ciudadEliminar = await Cities.update(
    { isActive: false },
    {
      where: {
        id: idParam,
      },
    }
  );
  res.status(201).json(ciudadEliminar);
});

/*-----------------End of Region / Ciudad -----------------*/

/*----------------- Companies -----------------*/
server.get("/companies", async (req, res) => {
  const allCompanies = await Companies.findAll({
    attributes: ["id", "name", "address", "email", "telephone"],
    where: { isActive: true },
    include: {
      model: Cities,
      attributes: ["id", "name", "isActive"],
      include: {
        model: Countries,
        attributes: ["id", "name", "isActive"],
        include: {
          model: Regions,
          attributes: ["id", "name"],
        },
      },
    },
  });
  res.status(200).json(allCompanies);
});

server.post("/companies", verifyCompanyExistsMiddleware, verifyCompanyBodyMiddleware,async (req, res) => {
  const { name, address, email, telephone, cities_id } = req.body;
  const nuevaCompania = await Companies.create({
    name,
    address,
    email,
    telephone,
    cities_id,
  });
  res.status(200).json(nuevaCompania);
});

server.put("/companies/:id", verifyCompanyBodyMiddleware, async (req, res) => {
  const idParam = req.params.id;
  const { name, address, email, telephone, cities_id } = req.body;
  const nuevaCompania = await Companies.update(
    {
      name,
      address,
      email,
      telephone,
      cities_id,
    },
    {
      where: {
        id: idParam,
      },
    }
  );
  res.status(201).json(nuevaCompania);
});

server.delete("/companies/:id", async (req, res) => {
  const idParam = req.params.id;
  const nuevaCompania = await Companies.update(
    {
      isActive: false,
    },
    {
      where: {
        id: idParam,
      },
    }
  );
  res.status(201).json(nuevaCompania);
});

/*-----------------End of companias -----------------*/

/*-----------------Start of Contacts -----------------*/

server.get("/contacts", async (req, res) => {
  const contacts = await Contacts.findAll({
    where: { isActive: true },
    include: [
      {
        model: Cities, attributes: ["id", "name", "isActive"],
        include: [
          {
            model: Countries, attributes: ["id", "name", "isActive"],
            include: [
              { model: Regions, attributes: ["id", "name"] },
            ]
          },
        ]
      },

      { model: Companies, attributes: ["id", "name"] },
      { model: Channels, attributes: ["id", "name"] },
    ],
  });
  res.status(200).json(contacts);
});


server.post("/contacts", verifyContactExistsMiddleware, verifyContactBodyMiddleware, async (req, res) => {
  const { firstName, lastName, position, email, address, cities_id, companies_id, interest } = req.body;
  const channels = req.body.channels;
  const nuevoContacto = await Contacts.create({
    firstName:firstName,
    lastName:lastName,
    position:position,
    email:email,
    address:address,
    cities_id:cities_id,
    companies_id: companies_id,
    interest: interest
  });

  await Promise.all(channels.map(async (channel)=>{
    await ContactsHasChannels.create({
        contact_id: nuevoContacto.id,
        channel_id: channel.channel_id,
        account: channel.account,
        preferences: channel.preferences
    },{
        fields: ["contact_id","channel_id","account", "preferences"]
    });
  }));

  res.status(200).json(nuevoContacto);

});


server.get("/channels", async (req, res) => {
    const channels = await Channels.findAll({
        attributes: ["id", "name"]
    });
    res.status(200).json(channels);
});



server.put("/contacts/:id", verifyContactBodyMiddleware, async (req,res) =>{
  const idParam = req.params.id;
  const { firstName, lastName, position, email, address, cities_id, companies_id, interest } = req.body;
  const channels = req.body.channels;
  const posibleContacto= await Contacts.findOne({
      where: {
          id:idParam,
      }
  })

  try {
    if (!posibleContacto) {
      res.status(404).json({
        error: `No existe contacto con id ${idParam}`
      });
    } else {
      await Contacts.update(
        {
          firstName: firstName,
          lastName: lastName,
          position: position,
          email: email,
          address: address,
          cities_id: cities_id,
          companies_id: companies_id,
          interest: interest
        },
        {
          where: {
            id: idParam,
          }
        });
    }
  
    channels.forEach(async (channel) => {
      if (channel.id == null) {
        await ContactsHasChannels.create({
          contact_id: idParam,
          channel_id: channel.channel_id,
          account: channel.account,
          preferences: channel.preferences
        }, {
          fields: ["contact_id", "channel_id", "account", "preferences"]
        });
      } else {
        const channelModif = await ContactsHasChannels.findOne({
          where: {
            id: channel.id
          }
        });
        if (channelModif) {
          await ContactsHasChannels.update(
            {
              channel_id: channel.channel_id,
              account: channel.account,
              preferences: channel.preferences,
              isActive: channel.isActive,
            },
            {
              where: {
                id:channel.id
              }
            });
        }
      }
    })
    res.status(201).json(`El contacto ${idParam} ha sido modificado.`);
  } catch (error) {
    console.log(error);
  }
  
});


server.delete("/contacts/:id", async (req,res) =>{
  const idParam = req.params.id;
  const contactoElim = await Contacts.update(
    {
        isActive: false,
    },
    {where:{
        id: idParam,
    }
  });
  res.status(201).json(contactoElim);
});

server.delete("/contacts", async (req,res) =>{
  const contactsDel = req.body.contactsDel;
  const contactoElim = await Contacts.update(
    {
        isActive: false,
    },
    {where:{
      id: {
        [Op.in]:contactsDel
      },
    }
  });
  res.status(201).json(contactoElim);
});

/*-----------------End of contacts -----------------*/

server.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en el puerto ${PORT}`);
});
