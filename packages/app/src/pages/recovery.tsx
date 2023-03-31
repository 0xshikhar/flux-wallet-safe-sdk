/* eslint-disable camelcase */
import { Button, FormControl, FormHelperText, FormLabel, Input, Link, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";

import { FluxWallet__factory } from "../../../contracts/typechain-types";

export interface PeerMeta {
  name: string;
  url: string;
}

const HomePage: NextPage = () => {
  const router = useRouter();

  const [fluxWalletAddress, setFluxWalletAddress] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const [isOk, setIsOk] = useState(false);
  const [inRecovery, setInRecovery] = useState(false);

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const txInit = async () => {
    if (!signer || !address) {
      return;
    }
    const contract = FluxWallet__factory.connect(fluxWalletAddress, signer);
    await contract.initiateRecovery(newOwner);
  };

  const txSupport = async () => {
    if (!signer || !address) {
      return;
    }
    const contract = FluxWallet__factory.connect(fluxWalletAddress, signer);
    await contract.supportRecovery(newOwner);
  };

  const txCancel = async () => {
    if (!signer || !address) {
      return;
    }
    const contract = FluxWallet__factory.connect(fluxWalletAddress, signer);
    await contract.cancelRecovery();
  };

  useEffect(() => {
    setFluxWalletAddress(router.query.address as string);
  }, [router]);

  useEffect(() => {
    if (!signer || !address || !fluxWalletAddress) {
      return;
    }
    const contract = FluxWallet__factory.connect(fluxWalletAddress, signer);
    contract.isGuardian(address).then((isOk) => {
      setIsOk(isOk);
    });

    contract.inRecovery().then((inRecovery) => {
      setInRecovery(inRecovery);
    });
  }, [signer, address, fluxWalletAddress]);

  const onClickLink = () => {
    router.push(`${origin}/recovery-confirm?address=${fluxWalletAddress}`);
  };

  return (
    <DefaultLayout>
      <Stack spacing="8">
        <Stack spacing="4">
          <Stack spacing="2">
            <FormControl>
              <FormLabel fontSize="md" fontWeight="bold">
                Recovery
              </FormLabel>
              <Text fontSize="xs">{fluxWalletAddress}</Text>
            </FormControl>
          </Stack>

          <Stack spacing="2">
            <FormControl>
              <FormLabel fontSize="md" fontWeight="bold">
                IsGuardian
              </FormLabel>
              <Text fontSize="xs">{isOk.toString()}</Text>
            </FormControl>
          </Stack>

          <Stack spacing="2">
            <FormControl>
              <FormLabel fontSize="md" fontWeight="bold">
                InRecovery
              </FormLabel>
              <Text fontSize="xs">{inRecovery.toString()}</Text>
            </FormControl>
          </Stack>

          <Stack spacing="2">
            <FormControl>
              <FormLabel>NewOwner</FormLabel>
              <Input type="text" fontSize="xs" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />
              <FormHelperText fontSize="xs" color="blue.600">
                * please input new owner and execute recovery
              </FormHelperText>
            </FormControl>
            <Button w="full" colorScheme="brand" onClick={txInit} isDisabled={!newOwner || !isOk || inRecovery}>
              Init
            </Button>
            <Button w="full" colorScheme="brand" onClick={txSupport} isDisabled={!newOwner || !isOk || !inRecovery}>
              Support
            </Button>
            <Button w="full" onClick={txCancel} isDisabled={!inRecovery}>
              Cancel
            </Button>
          </Stack>

          <Text
            onClick={onClickLink}
            as={Link}
            fontSize="xs"
          >{`${origin}/recovery-confirm?address=${fluxWalletAddress}`}</Text>
        </Stack>
      </Stack>
    </DefaultLayout>
  );
};

export default HomePage;
