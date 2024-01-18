# UnOfficial! baserow SDK by Bige

> [!IMPORTANT]  
> This package is released for testing for my personal needs. it is not recommended to use it at the moment because the next version will be heavily modified

> [!CAUTION] 
> this package is not official if you are looking for a client-only sdk prefer te official baserow-client availlable on npm

> [!NOTE]
> This SDK offers an approach based on different design patterns intended to simplify the development of complex and reactive applications. the idea being that each call can dispatch the state of your connectors reactively in vue, react or angular via redux, vuex or even pinia. The main objective being to maintain a single connector for different apps but also to offer a fluent approach simplifying the storage of your queries (par exemple)


## install

Ce sdk est rédigé en typescript et compilé en es5 pour les vieux.
il est utilisable en module en node ou vanilla.

> [!CAUTION] 
> il n'est pas recommandé de l'utiliser en production dans cette version.

```sh
npm i @landscape/baserow --save
yarn add @landscape/baserow
```

## usage

En module ou node require

```typescript
import { baserow } from "@landscape/baserow";
// OR
const baseerow = require('@landscape/baserow');
```

________________;

## Instances Baserow SDK

### créer une instance SDK

La proposition consiste a assembler divers connecteurs baserow.
Et c'est pourquoi vous devez utilliser la métode connector.
L'idée étant d'utiliser une instance SDK pour une multitude de token (voila).

<!-- executable -->
```javascript script
// javascript script
const sdk = new baserow();
const connector = sdk.connector(
    {
        email: "your_baserow_email *optional",
        password: "your_baserow_pwd *optional",
        token: "your_baserow_token",
        //proxy: "http://localhost:8080"
        //debug: false
    },
    false // live sync connector enable/disable sockets
);
connector.connect()
    .then(function(connected) {console.info(connected)})
    .catch(function(err) {console.error(err)});
```

________;

## WORKSPACES

Sur baserow un workspace permet de fragmenter et de gérer des accès.

### Récupérer vos workspaces

Après connexion vous pouvez récupérer vos workspaces.
Depuis le SDK les workspaces sont des fabriques.

<!-- executable -->
```typescript
const factory: workspaceFactory = connector.workspaces;
await factory.list({}, {}, false); // workspaceBuilder[]
const workspaces: workspaceBuilder[] = factory.workspaces
```

### Créeer un workspace

Pour créer un workspace il suffit d'être connecté à une instance de connector
et d'invoquer workspacesFactory.
la méthode create retourne un workspaceBuilder de façon asynchrone.

<!-- executable -->
```typescript
const workspace:workspaceBuilder = await workspaces.create('my workspace name');
```

### Renommer ou mettre à jour un workspace

L'unique méthode proposée par l'API OAS3 baserow consiste à le renommer.
Nous invoquerons update dans l'idée que d'autres paramètres pourraient arriver
lors de mmises à jour de l'API baserow.

<!-- executable -->
```javascript
await workspace.update('updated name');
// après l'appel le nom est mis à jour et loiquement 
// note: j'ai constaté des temps de propagation après avoir obtenu un code 200 de l'api
workspace.workspace.name
```

### Supprimer un workspace

la suppression d'un workspace peut également être effectuée depuis un  workspaceBuilder.
ici nous supprimons depuis la factory en précisant l'id du workspace à supprimer.

<!-- executable -->
```javascript
await workspaces.rm(workspace.workspace.id);
```

__________;

## APPLICATIONS

### lister les applications d'un workspace

Chaque workspaceBuilder comprend une applicationsFactory.
Cela permmet d'hériter de différentes méthodes commme la création de database ou applications.
A savoir sur baserow une application est généralement une database.
(je ne sais pas pourquoi appplication à creuser et  renommer  pour  que  ce  soit  plus  pparlant)

<!-- executable -->
```typescript
const workspace:workspaceBuilder = await workspaces.create('my test space');
const applications: applicationsFactory = workspace.applications;
```

### créer une application sur un workspace

Pour créer une application il suffit d'invouer la méthode create de votre applicationFactory.
pour rappel les app factories dépendent nécésserement d'un workspace et ne sont accessiblle que par authentification JWT pour des raisons de sécurité j'imagine.

<!-- executable -->
```typescript
const application:appBuilder = await applications.create('my test app');
```

### mettre à jour une application

Pour renommmer une applciation il suffit d'invoquer la méthode rename de votre applicationBuilder pattern.

<!-- executable -->
```javascript
await application.name('updated app name');
```

### supprimer une application

Pour supprimer une application vous devrez passer par l'applicationsFactory héritée de votre workspaceBuidler.

<!-- executable -->
```javascript
await applications.rm(application.app.id)
```


________;

## TABLES

### récupérer les tables d'une application

Maintenant que nous savons créer des applications  voyons comment y ajouter des tables.
Ici nous allons créer une table dans l'applciation courante puis la suppprimerons plus base pour ne pas polluer votre baserow.

<!-- executable -->
```typescript
const application:appBuilder = applications.create('my test app');
application.getTables(true);
const tables: tablesFactory = application.tables;
```

### Créer une table

Un appBuilder contient toujours une tablesFactory même vide.
et pour créer une table il  vous suffit d'invoquer la méthode create 
sur la table souhaitée par exemple :

<!-- executable -->
```typescript
const table:tableBuilder = tables.create('my table')
```

### Renommer une table

Maintenant ous pouvez facilement renommer une table en invoquant la méthode name() de votre tableBuilder:

<!-- executable -->
```typescript
await table.name('updated table name')
```

### Supprimer une table

Pour supprimer votre table vous invoquerez la méthode rm().
l'objet  delete  étant réservé au constructeur étendu de l'API,
nous avons choisi rm pour remove
@todo : créer un alias remove => rm

<!-- executable -->
```typescript
await tables.rm(table)
```


________;

## FIELDS

### récupéreer les fields d'une table

Les tables sont constituées de fields.
Par defaut baserow ajoute 3 fields (je ne sais p as pourquoi).
Pour l'instant vous ne pouvez pas les définir à la création
et nous observerons plus tard comment créer une table avec une structurre de donnée souhaitée.

<!-- executable -->
```typescript
const table:tableBuilder = tables.create('my table');
await table.getFields();
const fields:fieldBuiler[] = table.fields
```

### Créer un field

Pour créer des fields nous recommandons l'usage de l'enum FIELD_TYPE en typescript.
en javascript vous pourrez retrouver les types acceptés sur :
[la documentation api baserow](https://api.baserow.io/api/redoc/#tag/Database-table-fields/operation/update_database_table_field)

<!-- executable -->
```typescript
const field: fieldBuilder = table.addingField({
    type: 'text',
    name: 'my field'
    // props from field type allowed
});
await table.addField(field)
```

### Mettre à jour un field

L'objet field est assez commplet et étendu aux field constructors
l'idée étant de vous offrir accès aux spec avec des fluent patterns.
A noter, noous ne l'avons pas  précisé  ci-dessus  lors de la creation simplement les syntaxes fluent sont disponibles sur tout type de field depuis le pattern fieldBuilder;

Ainsi et pour invoquer le constructeur d'un field vous utiliserez fieldBuilder.ctor;

Les options de constructeurs sont nombreuses et correspondent aux namespaces définis sur l'API baserow,
logiquement vous devriez retrouver vos petits.

<!-- executable -->
```typescript
import { FIELD_TYPE } from "@landscape/baserow/types";
const field: fieldBuilder = table.fields[0];
field
    .table_id(table.build().id)
    .name('my field')
    .primary(true)
    .type('FIELD_TYPE.LONG_TEXT')
    .read_only(true)
    .order(0);
const contructor = field.ctor;
constructor.text_default('my  default text available on text and long_text field constructor');
// field.ctor provide an access to any kind of propertis about fields type specifications
await field.update()

// alternatively you can use  tableBuilder to udpate any field such as ANY_FIELD or fieldBuilder ex :
field.name('updated from tableBuilder');
table.updateField(field)
```

### Supprimer un field

Pour supprimer un field vous invoquerez la méthode remove() de fieldBuilder;

<!-- executable -->
```typescript
const field: fieldBuilder = table.fields[0];
field.remove()
// also you are able to delete fields from tableBuilder ex :
table.deleteField(field)
```

### Récupérer l'historique d'un field

Lasuppression est directe.
en cas d'erreur vous pouvez retrouver votre historique WIP.

<!-- executable -->
```typescript
await field.history()
```


________;

## QUERY ROWS

### QUERY rows

Chaque table proopose des queries permettant de preserver en mémoire différentes requêtes s'apparentant à des vues simplifiées et non stockées sur baserow.

De cette façon vous pouvez effectuer de  multiples requêtes en  parrallele sans qu'elles soient abandonnées.

Les Queries du pattern tableBuilder offrent divers paramètres que noous documenterons plus tard comme le debounce qui par defaut vas prévenir puis abandonner les query précédentes qui n'auraient pas encore abouties.
Par exemple enn utilisant la méthode search() sur une fréquence de frappe cela va prévenir des appels inutils et ainsi préserver la santé de votre application d'eventuels heat memory.

<!-- executable -->
```typescript
const table:tableBuilder = tables.tables[0]; 
const query:queryBuilder = table.query(); 
const result : BASEROW_RESULT = await query.size(12)
    .page(2)
    .search('foo')
    .order_by('field_name', 'ASC')
    .addInclude('field_name')
    .removeInclude('field_name')
    .includes(['field_1', 'field_2'])
    .addExclude('field_3')
    .removeExclude('field_3')
    .excludes(['field_3', '...'])
    .scroll('JWT');
// note : results is also stored on your current queryBuilder
const res = query.results;
```

## query next rows

L'objet queryBuilder propose de  simplifier les paginations en utilisant la méthode next().
cette méthode propose le paramètre join:boolean  qui s'occupera de  ne pas recharger les rows existants en  mémoire mais également de merger les réponses précédentes dans un unique objectBuilder rowBuidlder[].

Nous observerons plus bas comment l'utilise;

<!-- executable -->
```typescript
const table:tableBuilder = tables.tables[0]; 
const query:queryBuilder = table.query(); 
await query.scroll('JWT');
const res = await query.next(true); // (join:boolean): allow you to merge rows results in memory
```

## query previous rows

Comme pour la méthode next vous pouvez utiliserl a méthode prev() pour charger les rows ou pages précédentes.

<!-- executable -->
```typescript
const table:tableBuilder = tables.tables[0]; 
const query:queryBuilder = table.query(); 
await query.scroll('JWT');
const res = await query.prev(true); // (join:boolean): allow you to merge rows results in memory
```

## query filters

La documentation filters est assez particulière et si vous êtes habitué à postgres vous serez  probablement  perturbé au départ avec baserow.

Ceci dit nous avons simplifié les filtres sur le SDK permettant de ne plus se poser de questions sur leurs structure ce qui je pense est un réel gain de  temps (à noter ils ne fonctionnent que  partieellement  sur n8n ce qui a été une motivation pour l'écriture de ce SDK).

<!-- executable -->
```typescript
const table:tableBuilder = tables.tables[0]; 
const query:queryBuilder = table.query();
query.filter
    .filter_type('OR')
    .add('field_name', 'equal', 'foo')
    .add('field_name', 'equal', 'bar');
const res = await query.scroll('JWT');
```

### grouping filters

Vous pouvez également créer des filtres avancés facilement sans pour autant utiliser ou  créer de nouvelles views. (d'ailleurs nous verrons plus bas comment manager les views et surtout les requêter pour  vos dashboards)

!important : Pour executer des groupes sans filtres de premier niveau,
vous devrez tooujours définir <b>un filter_type d'entrée</b>.

Voici comment créer des groupes filtre :

<!-- executable -->
```typescript
import { BASEROW_QUERY_TYPE } from "@landscape/baserow/types";
const table:tableBuilder = tables.tables[0]; 
const query:queryBuilder = table.query();
query.filter_type('OR'); // first level filter type 'AND' by default
const group_1 = query.filter
    .group()
    .filter_type('OR')
    .add('field_name', BASEROW_QUERY_TYPE.equal, 'foo')
    .add('field_name', BASEROW_QUERY_TYPE.contains, 'bar');
const group_2 = query.filter
    .group()
    .filter_type('AND')
    .add('field_3', BASEROW_QUERY_TYPE.higher_than, 2)
    .add('field_4', BASEROW_QUERY_TYPE.boolean, true);
await query.scroll('JWT');
const res = query.results;
```

### Basic Auth Query without with app token

Les exemples précédents utilisent une authentification JWT pour des raisons de sécurité.
Pour une utillisation Front-End vous devrez créer une instance SDK connector avec un jeton API.
pour créer un token et lui attribuer des drois vous devez vous rendre sur baserow.

A noter les queries faisant appel à des applications non autorisées par le jeton seront évidement en faillure.
Pour requêter vous devrez probablement créer plusieurs instances selon les droits aloués à chaque jetons.

la gestion des droits des token est en cours d'optimisation.

<!-- executable -->
```typescript
import { baserow } from "@landscape/baserow/baserow";
const sdk = new baserow();
const connector:connectionBuilder = sdk.connector(
    {
        token: "your_baserow_token"
    },
    false // live sync connector enable/disable sockets
);
const query: queryBuilder = new queryBuilder({}, {id: 123}, connector);
await query.scroll('Token');
const res: BASEROW_RESULT = query.results;
const rows: rowBuidler[] = query.rows;

query.search('foo').scroll();
// update query results and reactive linked rows

query.reset().scroll(); // reedo scroll with default params


const query2 = new queryBuilder({
    size: 10,
    page: 2,
    user_field_names: true,
    filters: {filter_type: "AND", filters:[
        {
            field: 'field_1',
            type: 'equal',
            value: "foo"
        },
        {
            field: 'field_2',
            type: 'lower_than',
            value: 4
        }
    ]}
})
await query2.scroll();
await query2.next();
await query2.prev();
query2.filters.clear(); // clear all applied filters
query2.filters.filter_type('OR')
    .group()
        .add('field_2', 'higher_than', 5)
        .add('field_2', 'lower_than', 10)

query2.scroll();
// ... reuse your query builders as well
// same effects as a baserow view except footers
```

___________;

## ROWS et rowBuilder

### Query rows builder

Chaque Query offre l'accès à un rowsFactory lui même composé de rowBuilder.
Cette structure est intéressante pour la réactivité de vos applications qui peuvent donc s'y abonner.

<!-- executable -->
```typescript
const table: tableBuilder = tables.tables[0]; 
const query: queryBuilder = table.query();
await query.scroll('JWT');
const rows: rowBuidler[] = query.rows;
```

#### mettre à jour un row

La  mise à jour est toujours effectuée via patch ce qui permet des  mises à jour partieelles de vos entrées.

Voici un exemple en  considérant que la query précédente contient au  moins un résultat :

<!-- executable -->
```javascript
if (rows  && rows[0]) {
    const row = rows[0];
    await row.update({'field_1', 'foo'});
    console.log(row.fields); // field_name serra égal à 'foo'
}
```

#### insérer une ligne (add row)

<!-- executable -->
```javascript
if (rows  && rows[0]) {
    const row = rows[0];
    await row.insert({'field_1', 'foo'});
    console.log(row.fields); // field_name serra égal à 'foo'
}
```

#### supprimer une ligne (row)

<!-- executable -->
```javascript
if (rows  && rows[0]) {
    const row = rows[0];
    await row.update({'field_1', 'foo'});
    console.log(row.fields); // field_name serra égal à 'foo'
}
```

#### RowBuilder et constructeur

Que ce soit à la suite d'une query ou lors de la conception,
chaque rows devient un builder constitué d'un constructeur dédié.

par defaut baserow propose une mmultitude de types comme :

- text
- long_text
- email
- phone number
- boolean
- color
- count
- date
- formula
- link_row
- lookup
- rollup
- et caetera ...

Je ne vais pas tout documenter ici mais dans l'idée voici comment accéder aux propriétés d'un row depuis l'objet _fields ou encore depuis son constructor.

### Row _fields

> [NOTE!]
> certains fields comme formula ne sont pas encore disponibles.

Dans la majorité des cas d'usages @landscape/baserow propose une api dédiée par type.
et cette api est notament composée  de l'object _field qui va disparaître au profit de patterns plus enrichihs.

L'intéret de cet objectBuilder est de proposer des innputs consistants et de limiter les appels ineffiscients par exemple pour un field de  type texte :

```javascript
// on connsidere qu'on a un field selectionné de type text exemple ;
instanceOf field === fieldBuilder && instanceOf field.ctor === textConstructor;

// invoquer la methhode _field va renvoyer l'objet form suivant
const form = field._fields();
/**
 form = text_default: {
    type: 'string',
    required: false
 }
**/
```

De cette façon lorsque vous créez une interface vous pouvez proposer text_default depuis l'api OAS de baserow.

### Object _field field date par exemple

Maintenant prenons le type date pour le même exercice :

```javascript
// on connsidere qu'on a un field selectionné de type date exemple ;
instanceOf field === fieldBuilder && instanceOf field.ctor === dateConstructor;

// invoquer la methhode _field va renvoyer l'objet form suivant
const form = field._fields();
/**
 form = date_format: {
    type: 'select',
    required: true,
    options: [
        {
            key: 'europe dd/mm/YYYY',
            value: 'EU'
        },
        {
            key: 'american mm/dd/YYYY',
            value: 'US'
        },
        {
            key: 'ISO YYYY/MM/DD',
            value: 'ISO'
        }
    ]
},
date_include_time: {
    type: 'boolean',
    required: true,
    childrens: {
        date_time_format: {
            value: true,
            type: 'select',
            required: true,
            options: [
                {
                    key: 'europe dd/mm/YYYY',
                    value: 'dd/mm/YYYY'
                },
                {
                    key: 'american mm/dd/YYYY',
                    value: 'dd/mm/YYYY'
                },
                {
                    key: 'ISO YYYY/MM/DD',
                    value: 'YYYY/MM/DD'
                }
            ]
        },
    }
},
date_show_tzinfo: {
    type: 'boolean',
    required: true,
},
date_force_timezone: {
    type: 'boolean',
    required: false,
}
**/
```

## TLDR; => l'objet field._fields

Trop long à documenter dans un markdown,
la proposition consiste donc à définir et scoper sur chaque field type depuis l'objet _field et par la même occasion vous offrir l'opportunité de typer vos formulaires et vérifier vos appels api.

> C'est pratique et léger en front ou back !

## Voyons field._fields en constructeur maitenant

C'est comme l'object field._fields mais en pattern builder.
Ce qu'il faut savoir c'est qu'un field sera toujours proposé par son constructeur.
(s'il est documenté "obviously")

repenons _fields depuis le contructeur text comme exemple :

```javascript
// on considere que :
instanceOf field === textConstructor;

// alors nous pouvons proposer depuis son constructeur :
field.text_default("foo") // n'autorise que string > 0
```

la même chose en fluent depuis le conntructeur field dateConstructor :

```javascript

const field = new fieldBuilder(
    field: DATE_FIELD, 
    table: Partial<tableBuilder>, // {id:table_id} required
    setups: BASEROW_SETUPS, // {} TODO remove BASEROW_SETUPS from fieldBuilder
    connector: connectionBuilder // une instance baserow connectée => la base !
);

// ce field builder est  utilisable n'importe ou et modifiable.
// tu pourrais très bien changer de table etc.

// bref du coup tu sais écrire ceci :
field.date_format(DATE_FORMAT)
    .date_include_time(boolean)
    .date_time_format(DATE_TIME)
    .date_show_tzinfo(boolean)
    .date_force_timezone(boolean); // return dateBuilder extended from fieldBuilder
field.build(); // retourne FIELD_DATE

```

### TLDR;

Tout ça c'est bien beau mais concrétement ?
En clair ça te permet d'éviter d'écrire du caca mais également de savoir ce qui sera écris dans ta database.

Ceci dit et pour deux raisons fieldBuilder est agnostique.

du coup tu sais également écrire ce que tu veux sans types ex :

```javascript
const field = new fieldBuilder(
    field: ANY_FIELD, 
    table: Partial<tableBuilder>, // {id:table_id} required
    setups: BASEROW_SETUPS, // {} TODO remove BASEROW_SETUPS from fieldBuilder
    connector: connectionBuilder // une instance baserow connectée => la base !
);
field.set({
    foo: "bar",
    bar: new Date(),
    baz: 3,
    // etc...
})
```

> tu peux définir un row comme tu veux,
> Simplement ça risque de ne pas plaire à l'API...
> ;-)


## Features

> [!NOTE]
> Features in progress :

- testing
  - j'ai écris quelque tests pratiques et incomplets
  - test rows et fields en cours
- documentation :
  - fields and fieldBuilders
  - fields and history
  - fields forms and warns
  - fields fluent constructor
- views :
  - les views ne sont pas intégrées
  - in progress
- trash :
  - la corbeille n'est pas inntégrée wip
- fields :
  - pour le moment certains fields sont disponibles
  - formula est en cours...
  - rollup. manque de documentation WIP
  - boolean (je cherche comment mettre une valeur par defaut)
  - lookup (wip : documentation en lecture)
  - file le field file n'est pas du tout intégré en édition
  - des checks divers sont en cours  pour prévenir des appels api non effectifs
- demo and flow
  - demo vike en cours de production
  - rendu de vos dataflow en cours
  - case studies + divers wip
  - designrow proposera de simplifier votre UI via baserow mais aussi d'autres connecteurs open source...