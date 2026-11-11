{
  description = "HR Management System Dev Shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachSystem [ "x86_64-linux" "aarch64-linux" ] (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            nodejs_22
            docker
            docker-compose
            mysql80
            git
            gnumake
            jq
            curl
          ];

          shellHook = ''
            if [ ! -f .env ]; then
              cp .env.example .env
              echo "Created .env from .env.example"
            fi
            export NEXT_TELEMETRY_DISABLED=1

            echo ""
            echo "=========================================="
            echo "  HR Management System Dev Shell Active  "
            echo "=========================================="
            echo "Commands available:"
            echo "  make up         - Start all services (Docker Compose)"
            echo "  make down       - Stop all services"
            echo "  make dev        - Start dev mode with hot reload"
            echo "  make logs       - Tail container logs"
            echo "  make reset-db   - Reset database volume and recreate"
            echo "  make seed-demo  - Load demo dataset (40+ employees, Q2 attendance)"
            echo "=========================================="
            echo ""
          '';
        };
      }
    );
}
