## [1.3.1](https://github.com/Quackoloc/api/compare/v1.3.0...v1.3.1) (2025-06-24)


### Bug Fixes

* **ci:** remove Docker build & push steps ([a3cd156](https://github.com/Quackoloc/api/commit/a3cd156564e70625ed1ba42ccb57b351a5ca065c))

# [1.3.0](https://github.com/Quackoloc/api/compare/v1.2.1...v1.3.0) (2025-06-15)


### Features

* **auth:** implement logout route ([45e9de8](https://github.com/Quackoloc/api/commit/45e9de82fcc73ce88fd7952a8b9532cce349e3a1))
* **colocation:** [QUAC-47] Créer les routes pour créer/récupérer/éditer une tâche ([0817ec9](https://github.com/Quackoloc/api/commit/0817ec9d2b8cc89986a467ce7ad36f272b6814c5))
* **task:** update task status, update tests & add PUT to cors ([b999f6c](https://github.com/Quackoloc/api/commit/b999f6ce907109a72d750ca2bd764b437d580ab6))

## [1.2.1](https://github.com/Quackoloc/api/compare/v1.2.0...v1.2.1) (2025-06-13)


### Bug Fixes

* **healthcheck:** add [@get](https://github.com/get) / route to avoir 404 errors with clever cloud healthcheck ([ed77c25](https://github.com/Quackoloc/api/commit/ed77c25144e5f03a54f3c030b47d765e9ea8b4c7))

# [1.2.0](https://github.com/Quackoloc/api/compare/v1.1.1...v1.2.0) (2025-06-13)


### Features

* **colocation:** update join colocation code route which not requires colocation id anymore ([7e048e1](https://github.com/Quackoloc/api/commit/7e048e184722620470d8b03c645d5f96c1a13ba6))
* **logs:** add logger in use cases for user actions ([76d2751](https://github.com/Quackoloc/api/commit/76d27513b5d46798647b00090cc4083840dbc985))

## [1.1.1](https://github.com/Quackoloc/api/compare/v1.1.0...v1.1.1) (2025-06-13)


### Bug Fixes

* **auth:** correct cors error ([f45a831](https://github.com/Quackoloc/api/commit/f45a83153fd194e2115a5d6767bb79582af23f42))

# [1.1.0](https://github.com/Quackoloc/api/compare/v1.0.0...v1.1.0) (2025-06-13)


### Features

* **auth:** update auth method (use cookie instead of returning the tokens in the json response) ([b8a59f4](https://github.com/Quackoloc/api/commit/b8a59f463ed7a39610af53d51c0eced01311a3b0))
* **colocation:** [QUAC-37] ETQU, je veux pouvoir personnaliser l’apparence (logo, couleurs) de la colocation pour renforcer son identité ([3bd55dc](https://github.com/Quackoloc/api/commit/3bd55dc0ba07524bd647229b0026411e55b00382))
* **colocation:** [QUAC-45] ETQU, je veux pouvoir rejoindre une colocation existante via code ([e6acd80](https://github.com/Quackoloc/api/commit/e6acd8002c3535a65bf15c86deef72a067157ca3))
* **tests:** add missing unit tests for use-cases ([4cfd887](https://github.com/Quackoloc/api/commit/4cfd887a98aa9e72565e95cd6ad1244bf98878fa))

# 1.0.0 (2025-06-11)


### Features

* **auth:** [QUAC-43] Créer les routes de register/login sur l'API ([e42fdd3](https://github.com/Quackoloc/api/commit/e42fdd3ca4c99eb1b51be082325ceb28e7b300c4))
* **deploy:** Premier déploiement ([7cf95f8](https://github.com/Quackoloc/api/commit/7cf95f8431dab91421a90fdd3de9cec7a714d19c))
