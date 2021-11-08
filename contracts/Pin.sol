// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IVoteMining {
  function claimMintRewards(address nftAddr, uint nftId, address to) external;
  function nfts(address nftAddr, uint nftId) external view returns(uint);
  function nftGroup(uint uid) external view returns(uint);
}
contract Pin is Ownable {
  using SafeMath for uint256;

  address public voteMiningV1;
  address public voteMiningV2;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(uint256 => address)) public ownerOf;

  struct NFT {
    address addr;
    uint id;
    address owner;
  }

  mapping (address => NFT[]) private _ownedTokens;
  

  event Pinned(address indexed user, address nftAddress, uint nftId);

  constructor(address _voteMiningV1, address _voteMiningV2) {
    voteMiningV1 = _voteMiningV1;
    voteMiningV2 = _voteMiningV2;
  }

  function setV2(address _v2) external onlyOwner {
    voteMiningV2 = _v2;
  }

  function pin(address nftAddr, uint nftId) external {
    uint uid = IVoteMining(voteMiningV1).nfts(nftAddr, nftId);
    if(IVoteMining(voteMiningV1).nftGroup(uid) == 1) {
      pinV1(nftAddr, nftId);
    } else {
      pinV2(nftAddr, nftId);
    }
  }

  function pinV1(address nftAddr, uint nftId) internal {
    IVoteMining(voteMiningV1).claimMintRewards(nftAddr, nftId, msg.sender);

    IERC721(nftAddr).transferFrom(msg.sender, address(this), nftId);
    _ownedTokens[msg.sender].push(NFT({
      addr: nftAddr,
      id: nftId,
      owner: msg.sender
    }));
    balanceOf[msg.sender] = balanceOf[msg.sender].add(1);
    ownerOf[nftAddr][nftId] = msg.sender;

    emit Pinned(msg.sender, nftAddr, nftId);
  }

  function pinV2(address nftAddr, uint nftId) internal {
    IVoteMining(voteMiningV2).claimMintRewards(nftAddr, nftId, msg.sender);

    IERC721(nftAddr).transferFrom(msg.sender, address(this), nftId);
    _ownedTokens[msg.sender].push(NFT({
      addr: nftAddr,
      id: nftId,
      owner: msg.sender
    }));
    balanceOf[msg.sender] = balanceOf[msg.sender].add(1);
    ownerOf[nftAddr][nftId] = msg.sender;

    emit Pinned(msg.sender, nftAddr, nftId);
  }

  function tokenOfOwnerByIndex(address owner, uint index) public view returns(address, uint) {
    require(index < balanceOf[owner], "Pin: owner index out of bounds");
    return (_ownedTokens[owner][index].addr, _ownedTokens[owner][index].id);
  }

  function withdraw(address nftAddr, uint nftId, address to) external onlyOwner {
    IERC721(nftAddr).transferFrom(address(this), to, nftId);
  }
}